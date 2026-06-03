"use client";

import { MapPin, Star, ChevronRight, Navigation, Clock } from 'lucide-react';
import { Place, SearchResult } from "@/lib/types";
import { getCategoryIcon, formatPlaceType } from "@/lib/places";
import { searchResultToPlace } from "@/lib/nominatim";
import Link from "next/link";

interface SidebarProps {
  results: SearchResult[];
  selectedPlace: Place | null;
  isOpen: boolean;
  onSelectResult: (result: SearchResult) => void;
  onClose: () => void;
}

export default function Sidebar({
  results,
  selectedPlace,
  isOpen,
  onSelectResult,
  onClose,
}: SidebarProps) {
  if (!isOpen && results.length === 0 && !selectedPlace) return null;

  return (
    <div className="absolute top-0 left-0 h-full w-80 bg-white shadow-2xl z-30 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white">
        <h2 className="text-sm font-semibold text-gray-700">
          {results.length > 0
            ? results.length + " results"
            : selectedPlace
            ? "Place Details"
            : "Search Results"}
        </h2>
        <button
          onClick={onClose}
          className="text-xs text-blue-500 hover:text-blue-700 font-medium"
        >
          Close
        </button>
      </div>

      {/* Results list */}
      <div className="flex-1 overflow-y-auto">
        {results.length > 0 ? (
          <div>
            {results.map((result, idx) => {
              const place = searchResultToPlace(result);
              const nameParts = result.display_name.split(",");
              return (
                <button
                  key={result.place_id + "-" + idx}
                  onClick={() => onSelectResult(result)}
                  className="w-full flex items-start gap-3 px-4 py-4 hover:bg-gray-50 transition-colors border-b border-gray-50 text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-lg">
                    {getCategoryIcon(result.class)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {nameParts[0]}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {nameParts.slice(1, 3).join(", ")}
                    </p>
                    <span className="inline-block mt-1 text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full capitalize">
                      {formatPlaceType(result.type)}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                </button>
              );
            })}
          </div>
        ) : selectedPlace ? (
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-2xl">
                {getCategoryIcon(selectedPlace.category)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {selectedPlace.name}
                </h3>
                <p className="text-xs text-gray-500 capitalize">
                  {formatPlaceType(selectedPlace.type)}
                </p>
              </div>
            </div>

            {selectedPlace.rating && (
              <div className="flex items-center gap-2 mb-3 p-3 bg-gray-50 rounded-xl">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium text-gray-800">
                  {selectedPlace.rating}
                </span>
                {selectedPlace.reviewCount && (
                  <span className="text-xs text-gray-500">
                    ({selectedPlace.reviewCount.toLocaleString()} reviews)
                  </span>
                )}
              </div>
            )}

            <div className="flex items-start gap-2 mb-4">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600 leading-relaxed">
                {selectedPlace.address || selectedPlace.displayName}
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/directions"
                className="flex-1 flex items-center justify-center gap-1.5 bg-blue-500 text-white text-sm font-medium py-2.5 rounded-full hover:bg-blue-600 transition-colors"
              >
                <Navigation className="w-4 h-4" />
                Directions
              </Link>
              <Link
                href={"/place/" + selectedPlace.osmType + "-" + selectedPlace.osmId}
                className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 text-gray-700 text-sm font-medium py-2.5 rounded-full hover:bg-gray-200 transition-colors"
              >
                More info
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <MapPin className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">
              Search for a place to see results here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
