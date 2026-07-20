"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Loader2 } from "lucide-react";

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

type NominatimResult = {
  display_name: string;
  lat: string;
  lon: string;
  name?: string;
  namedetails?: { name?: string };
};

export function AddressAutocomplete({ name, defaultValue, onPlaceSelected }: Props) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (newValue: string) => {
    setValue(newValue);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (newValue.trim().length < 2) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          q: newValue,
          format: "json",
          countrycodes: "jp",
          addressdetails: "1",
          namedetails: "1",
          limit: "5",
          "accept-language": "ja",
        });
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?${params.toString()}`
        );
        const data: NominatimResult[] = await res.json();
        setResults(data);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 600);
  };

  const handleSelect = (result: NominatimResult) => {
    const address = result.display_name;
    setValue(address);
    setOpen(false);
    setResults([]);
    onPlaceSelected?.({
      address,
      venueName: result.namedetails?.name ?? result.name ?? "",
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
    });
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Input
          name={name}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="住所や施設名を入力(例: 東京駅)"
          autoComplete="off"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full animate-in fade-in-0 slide-in-from-top-1 rounded-md border bg-popover shadow-md duration-150">
          {results.map((result, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(result)}
              className="flex w-full items-start gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
            >
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="line-clamp-2">{result.display_name}</span>
            </button>
          ))}
        </div>
      )}

      <p className="mt-1 text-xs text-muted-foreground">
        住所検索: OpenStreetMap
      </p>
    </div>
  );
}
