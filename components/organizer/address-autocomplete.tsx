"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Input } from "@/components/ui/input";

type Props = {
  name: string;
  defaultValue?: string;
  onPlaceSelected?: (details: {
    address: string;
    venueName: string;
    lat: number;
    lng: number;
  }) => void;
};

declare global {
  interface Window {
    google: typeof google;
  }
}

export function AddressAutocomplete({ name, defaultValue, onPlaceSelected }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [value, setValue] = useState(defaultValue ?? "");

  useEffect(() => {
    if (!scriptLoaded || !inputRef.current || !window.google) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      fields: ["formatted_address", "name", "geometry"],
      componentRestrictions: { country: "jp" },
    });

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const address = place.formatted_address ?? "";
      setValue(address);
      onPlaceSelected?.({
        address,
        venueName: place.name ?? "",
        lat: place.geometry?.location?.lat() ?? 0,
        lng: place.geometry?.location?.lng() ?? 0,
      });
    });

    return () => {
      window.google.maps.event.removeListener(listener);
    };
  }, [scriptLoaded, onPlaceSelected]);

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&language=ja`}
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <Input
        ref={inputRef}
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="住所や会場名を入力すると候補が表示されます"
        autoComplete="off"
      />
    </>
  );
}
