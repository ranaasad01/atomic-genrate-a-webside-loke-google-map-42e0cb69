"use client";

import { useRef, useEffect } from "react";
import { Search } from 'lucide-react';

interface PlacesSearchBarProps {
  onPlaceSelect: (place: { name: string; lat: number; lng: number; address: string }) => void;
  placeholder?: string;
  className?: string;
}

export default function PlacesSearchBar({
  onPlaceSelect,
  placeholder = "Search places...",
  className = "",
}: PlacesSearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places) return;
    if (!inputRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      { fields: ["name", "geometry", "formatted_address"] }
    );

    const listener = autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current!.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      onPlaceSelect({
        name: place.name ?? "",
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        address: place.formatted_address ?? "",
      });
    });

    return () => {
      window.google.maps.event.removeListener(listener);
    };
  }, [onPlaceSelect]);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className="w-full pl-10 px-4 py-2.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.2)] outline-none text-sm text-gray-800 placeholder-gray-400 bg-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-shadow"
      />
    </div>
  );
}
