"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Navigation, Car, Clock, Route } from 'lucide-react';
import DirectionsPanel from "@/components/DirectionsPanel";
import { useDirections } from "@/hooks/useDirections";
import { LatLng, Marker } from "@/lib/types";
import { defaultCenter } from "@/lib/mapLayers";
import { searchResultToPlace } from "@/lib/nominatim";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Loading map...</p>
      </div>
    </div>
  ),
});

export default function DirectionsPage() {
  const {
    origin,
    destination,
    originQuery,
    destinationQuery,
    originResults,
    destinationResults,
    route,
    isLoading,
    error,
    searchOrigin,
    searchDestination,
    selectOrigin,
    selectDestination,
    calculateRoute,
    clearRoute,
  } = useDirections();

  const [mapCenter, setMapCenter] = useState<LatLng>(defaultCenter);
  const [mapZoom, setMapZoom] = useState(10);

  const handleSelectOrigin = useCallback(
    (result: any) => {
      selectOrigin(result);
      const place = searchResultToPlace(result);
      setMapCenter({ lat: place.lat, lng: place.lng });
      setMapZoom(13);
    },
    [selectOrigin]
  );

  const handleSelectDestination = useCallback(
    (result: any) => {
      selectDestination(result);
      const place = searchResultToPlace(result);
      setMapCenter({ lat: place.lat, lng: place.lng });
      setMapZoom(13);
    },
    [selectDestination]
  );

  const routeCoords =
    route?.geometry?.coordinates as [number, number][] | undefined;

  const markers: Marker[] = [];
  if (origin) {
    const p = searchResultToPlace(origin);
    markers.push({
      id: "origin",
      position: { lat: p.lat, lng: p.lng },
      title: "Start: " + p.name,
    });
  }
  if (destination) {
    const p = searchResultToPlace(destination);
    markers.push({
      id: "destination",
      position: { lat: p.lat, lng: p.lng },
      title: "End: " + p.name,
    });
  }

  return (
    <main className="flex w-screen h-screen overflow-hidden bg-gray-100">
      {/* Left panel */}
      <div className="w-80 flex-shrink-0 h-full overflow-hidden flex flex-col shadow-2xl z-30 relative">
        {/* Back button */}
        <div className="absolute top-0 left-0 right-0 z-10">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-3 bg-white border-b border-gray-100 text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Map</span>
          </Link>
        </div>
        <div className="pt-10 h-full overflow-hidden">
          <DirectionsPanel
            originQuery={originQuery}
            destinationQuery={destinationQuery}
            originResults={originResults}
            destinationResults={destinationResults}
            route={route}
            isLoading={isLoading}
            error={error}
            onOriginSearch={searchOrigin}
            onDestinationSearch={searchDestination}
            onSelectOrigin={handleSelectOrigin}
            onSelectDestination={handleSelectDestination}
            onCalculate={calculateRoute}
            onClear={clearRoute}
          />
        </div>
      </div>

      {/* Map area */}
      <div className="flex-1 relative">
        <LeafletMap
          center={mapCenter}
          zoom={mapZoom}
          mapType="standard"
          markers={markers}
          routeCoords={routeCoords}
          className="w-full h-full"
        />

        {/* Route info overlay */}
        {route && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 px-5 py-3 flex items-center gap-4">
              <div className="flex items-center gap-2 text-green-600">
                <Car className="w-5 h-5" />
                <span className="font-semibold text-sm">Fastest Route</span>
              </div>
              <div className="w-px h-6 bg-gray-200" />
              <div className="flex items-center gap-1.5 text-gray-700">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">
                  {Math.round(route.duration / 60)} min
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-700">
                <Route className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">
                  {(route.distance / 1000).toFixed(1)} km
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Empty state overlay */}
        {!route && !isLoading && (
          <div className="absolute inset-0 flex items-end justify-center pb-12 pointer-events-none">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 px-6 py-4 text-center max-w-sm mx-4">
              <Navigation className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800 text-sm mb-1">
                Plan Your Route
              </h3>
              <p className="text-xs text-gray-500">
                Enter a starting point and destination in the panel on the left
                to get turn-by-turn directions with distance and travel time.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
