"use client";

import { useRef, useEffect } from "react";
import { Search, X, Loader2, MapPin, Navigation } from 'lucide-react';
import { SearchResult } from "@/lib/types";

interface SearchBarProps {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  isOpen: boolean;
  onSearch: (value: string) => void;
  onSelect: (result: SearchResult) => void;
  onClear: () => void;
  onClose: () => void;
  onCurrentLocation?: () => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  query,
  results,
  isLoading,
  isOpen,
  onSearch,
  onSelect,
  onClear,
  onClose,
  onCurrentLocation,
  placeholder = "Search Google Maps",
  className = "",
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div ref={containerRef} className={"relative " + className}>
      <div className="flex items-center bg-white rounded-full shadow-lg border border-gray-200 px-4 py-2.5 gap-3 hover:shadow-xl transition-shadow">
        {isLoading ? (
          <Loader2 className="w-5 h-5 text-blue-500 animate-spin flex-shrink-0" />
        ) : (
          <Search className="w-5 h-5 text-gray-500 flex-shrink-0" />
        )}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          className="flex-1 outline-none text-gray-800 text-sm bg-transparent placeholder-gray-400 min-w-0"
        />
        {query && (
          <button
            onClick={onClear}
            className="p-0.5 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
        {onCurrentLocation && (
          <button
            onClick={onCurrentLocation}
            className="p-1 rounded-full hover:bg-blue-50 transition-colors flex-shrink-0 border-l border-gray-200 pl-3 ml-1"
            title="Use current location"
          >
            <Navigation className="w-4 h-4 text-blue-500" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-80 overflow-y-auto">
          {results.map((result, idx) => {
            const nameParts = result.display_name.split(",");
            const name = nameParts[0];
            const address = nameParts.slice(1, 3).join(",").trim();
            return (
              <button
                key={result.place_id + "-" + idx}
                onClick={() => onSelect(result)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-gray-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {name}
                  </p>
                  {address && (
                    <p className="text-xs text-gray-500 truncate">{address}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
