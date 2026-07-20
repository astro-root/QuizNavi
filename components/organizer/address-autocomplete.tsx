"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Label } from "@/components/ui/label";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [displayValue, setDisplayValue] = useState(defaultValue ?? "");

  useEffect(() => {
    if (!scriptLoaded || !containerRef.current || !window.google) return;
    if (containerRef.current.childElementCount > 0) return;

    const el = new window.google.maps.places.PlaceAutocompleteElement({
      includedRegionCodes: ["jp"],
    });
    el.classList.add("gm-autocomplete-el");
    containerRef.current.appendChild(el);

    el.addEventListener("gmp-select", async (event: unknown) => {
      const placePrediction = (
        event as { placePrediction: { toPlace: () => google.maps.places.Place } }
      ).placePrediction;
      const place = placePrediction.toPlace();
      await place.fetchFields({
        fields: ["formattedAddress", "displayName", "location"],
      });

      const address = place.formattedAddress ?? "";
      setDisplayValue(address);
      if (hiddenInputRef.current) hiddenInputRef.current.value = address;

      onPlaceSelected?.({
        address,
        venueName: place.displayName ?? "",
        lat: place.location?.lat() ?? 0,
        lng: place.location?.lng() ?? 0,
      });
    });

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [scriptLoaded, onPlaceSelected]);

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&language=ja&loading=async`}
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <Label className="sr-only">住所検索</Label>
      <div ref={containerRef} className="gm-autocomplete-container" />
      <input type="hidden" name={name} ref={hiddenInputRef} value={displayValue} readOnly />
      {!scriptLoaded && (
        <p className="text-xs text-muted-foreground">住所検索を読み込み中...</p>
      )}
    </>
  );
}
