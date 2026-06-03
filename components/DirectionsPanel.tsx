"use client";

import { useState } from "react";
import { Navigation, MapPin, ArrowRight, Clock, Route, X, ChevronDown, ChevronRight, Car } from 'lucide-react';
import { SearchResult, Route as RouteType } from "@/lib/types";
import { formatDistance, formatDuration } from "@/lib/routing";

interface DirectionsPanelProps {
  originQuery: string;
  destinationQuery: string;
  originResults: SearchResult[];
  destinationResults: SearchResult[];
  route: RouteType | null;
  isLoading: boolean;
  error: string | null;
  onOriginSearch: (q: string) => void;
  onDestinationSearch: (q: string) => void;
  onSelectOrigin: (r: SearchResult) => void;
  onSelectDestination: (r: SearchResult) => void;
  onCalculate: () => void;
  onClear: () => void;
}

export default function DirectionsPanel({
  originQuery,
  destinationQuery,
  originResults,
  destinationResults,
  route,
  isLoading,
  error,
  onOriginSearch,
  onDestinationSearch,
  onSelectOrigin,
  onSelectDestination,
  onCalculate,
  onClear,
}: DirectionsPanelProps) {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  const steps = route?.legs?.[0]?.steps || [];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-4">
        <div className="flex items-center gap-2 mb-4">
          <Navigation className="w-5 h-5" />
          <h2 className="font-semibold text-base">Directions</h2>
        </div>

        {/* Origin input */}
        <div className="relative mb-2">
          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5">
            <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0" />
            <input
              type="text"
              value={originQuery}
              onChange={(e) => {
                onOriginSearch(e.target.value);
                setShowOriginDropdown(true);
              }}
              onFocus={() => setShowOriginDropdown(true)}
              placeholder="Choose starting point"
              className="flex-1 text-sm text-gray-800 outline-none placeholder-gray-400 bg-transparent"
            />
          </div>
          {showOriginDropdown && originResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-48 overflow-y-auto">
              {originResults.map((r, i) => (
                <button
                  key={r.place_id + "-o-" + i}
                  onClick={() => {
                    onSelectOrigin(r);
                    setShowOriginDropdown(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 text-left border-b border-gray-50 last:border-0"
                >
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 truncate">
                    {r.display_name.split(",")[0]}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Destination input */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5">
            <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
            <input
              type="text"
              value={destinationQuery}
              onChange={(e) => {
                onDestinationSearch(e.target.value);
                setShowDestDropdown(true);
              }}
              onFocus={() => setShowDestDropdown(true)}
              placeholder="Choose destination"
              className="flex-1 text-sm text-gray-800 outline-none placeholder-gray-400 bg-transparent"
            />
          </div>
          {showDestDropdown && destinationResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-48 overflow-y-auto">
              {destinationResults.map((r, i) => (
                <button
                  key={r.place_id + "-d-" + i}
                  onClick={() => {
                    onSelectDestination(r);
                    setShowDestDropdown(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 text-left border-b border-gray-50 last:border-0"
                >
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 truncate">
                    {r.display_name.split(",")[0]}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={onCalculate}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 bg-white text-blue-600 font-semibold text-sm py-2.5 rounded-xl hover:bg-blue-50 transition-colors disabled:opacity-60"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Route className="w-4 h-4" />
            )}
            {isLoading ? "Calculating..." : "Get Directions"}
          </button>
          <button
            onClick={onClear}
            className="w-10 h-10 flex items-center justify-center bg-blue-500 rounded-xl hover:bg-blue-400 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Route summary */}
      {route && (
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-3 bg-green-50 border-b border-green-100 flex items-center gap-4">
            <Car className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {formatDuration(route.duration)}
              </p>
              <p className="text-xs text-gray-500">
                {formatDistance(route.distance)} · Fastest route
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="divide-y divide-gray-50">
            {steps.map((step, idx) => (
              <div key={idx} className="px-4 py-3">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-gray-600">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 leading-snug">
                      {step.instruction || step.name || "Continue"}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatDistance(step.distance)} ·{" "}
                      {formatDuration(step.duration)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!route && !error && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <Navigation className="w-12 h-12 text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm font-medium mb-1">
            Plan your route
          </p>
          <p className="text-gray-400 text-xs">
            Enter a starting point and destination to get turn-by-turn
            directions
          </p>
        </div>
      )}
    </div>
  );
}
