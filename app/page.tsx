"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Navigation, Layers } from 'lucide-react';
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import MapTypeToggle from "@/components/MapTypeToggle";
import MapControls from "@/components/MapControls";
import PlaceInfoCard from "@/components/PlaceInfoCard";
import { useSearch } from "@/hooks/useSearch";
import { searchResultToPlace } from "@/lib/nominatim";
import { MapType, Place, Marker, LatLng, SearchResult } from "@/lib/types";
import { defaultCenter, defaultZoom } from "@/lib/mapLayers";
import { SAMPLE_PLACES } from "@/lib/places";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Loading map...</p>
      </div>
    </div>
  ),
});

export default function HomePage() {
  const [mapType, setMapType] = useState<MapType>("standard");
  const [center, setCenter] = useState<LatLng>(defaultCenter);
  const [zoom, setZoom] = useState(defaultZoom);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPlaceCard, setShowPlaceCard] = useState(false);
  const [showMapTypeToggle, setShowMapTypeToggle] = useState(false);
  const [sidebarResults, setSidebarResults] = useState<SearchResult[]>([]);

  const { query, results, isLoading, isOpen, search, clearSearch, closeDropdown } =
    useSearch();

  const handleSelectResult = useCallback(
    (result: SearchResult) => {
      const place = searchResultToPlace(result);
      setCenter({ lat: place.lat, lng: place.lng });
      setZoom(16);
      setSelectedPlace(place);
      setShowPlaceCard(true);
      setShowSidebar(true);
      setSidebarResults(results);
      closeDropdown();

      const newMarker: Marker = {
        id: place.id,
        position: { lat: place.lat, lng: place.lng },
        title: place.name,
        place,
      };
      setMarkers([newMarker]);
    },
    [results, closeDropdown]
  );

  const handleSidebarSelect = useCallback((result: SearchResult) => {
    const place = searchResultToPlace(result);
    setCenter({ lat: place.lat, lng: place.lng });
    setZoom(16);
    setSelectedPlace(place);
    setShowPlaceCard(true);
    const newMarker: Marker = {
      id: place.id,
      position: { lat: place.lat, lng: place.lng },
      title: place.name,
      place,
    };
    setMarkers([newMarker]);
  }, []);

  const handleCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setZoom(15);
        const locMarker: Marker = {
          id: "current-location",
          position: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          title: "Your Location",
        };
        setMarkers((prev) => [
          ...prev.filter((m) => m.id !== "current-location"),
          locMarker,
        ]);
      },
      (err) => console.error("Geolocation error:", err)
    );
  }, []);

  const handleMarkerClick = useCallback((marker: Marker) => {
    if (marker.place) {
      setSelectedPlace(marker.place);
      setShowPlaceCard(true);
    }
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(z + 1, 19));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(z - 1, 1));
  }, []);

  const handleSearchChange = useCallback(
    (value: string) => {
      search(value);
      if (!value) {
        setSidebarResults([]);
        setShowSidebar(false);
      }
    },
    [search]
  );

  const handleClearSearch = useCallback(() => {
    clearSearch();
    setSidebarResults([]);
    setShowSidebar(false);
    setSelectedPlace(null);
    setShowPlaceCard(false);
    setMarkers([]);
  }, [clearSearch]);

  // Sample markers from sample places
  const allMarkers: Marker[] = [
    ...SAMPLE_PLACES.map((p) => ({
      id: p.id,
      position: { lat: p.lat, lng: p.lng },
      title: p.name,
      place: p,
    })),
    ...markers,
  ];

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-gray-100">
      {/* Full-screen map */}
      <div className="absolute inset-0">
        <LeafletMap
          center={center}
          zoom={zoom}
          mapType={mapType}
          markers={allMarkers}
          onMarkerClick={handleMarkerClick}
          className="w-full h-full"
        />
      </div>

      {/* Sidebar */}
      {showSidebar && (
        <div className="absolute top-0 left-0 h-full w-80 z-30 shadow-2xl">
          <Sidebar
            results={sidebarResults}
            selectedPlace={selectedPlace}
            isOpen={showSidebar}
            onSelectResult={handleSidebarSelect}
            onClose={() => {
              setShowSidebar(false);
              setSidebarResults([]);
            }}
          />
        </div>
      )}

      {/* Top search bar */}
      <div
        className={
          "absolute top-4 z-40 transition-all duration-300 " +
          (showSidebar ? "left-84 right-4" : "left-4 right-4 sm:left-4 sm:right-auto sm:w-96")
        }
      >
        <SearchBar
          query={query}
          results={results}
          isLoading={isLoading}
          isOpen={isOpen}
          onSearch={handleSearchChange}
          onSelect={handleSelectResult}
          onClear={handleClearSearch}
          onClose={closeDropdown}
          onCurrentLocation={handleCurrentLocation}
          placeholder="Search Google Maps"
        />
      </div>

      {/* Right-side controls */}
      <div className="absolute right-4 bottom-24 z-40 flex flex-col gap-3">
        {/* Map type toggle button */}
        <div className="relative">
          <button
            onClick={() => setShowMapTypeToggle((v) => !v)}
            className="w-10 h-10 bg-white rounded-xl shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            title="Map type"
          >
            <Layers className="w-5 h-5 text-gray-700" />
          </button>
          {showMapTypeToggle && (
            <div className="absolute bottom-12 right-0">
              <MapTypeToggle current={mapType} onChange={(t) => { setMapType(t); setShowMapTypeToggle(false); }} />
            </div>
          )}
        </div>

        {/* Zoom + location controls */}
        <MapControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onCurrentLocation={handleCurrentLocation}
        />
      </div>

      {/* Place info card */}
      {showPlaceCard && selectedPlace && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 sm:left-auto sm:translate-x-0 sm:bottom-6 sm:right-16">
          <PlaceInfoCard
            place={selectedPlace}
            onClose={() => {
              setShowPlaceCard(false);
              setSelectedPlace(null);
            }}
            onDirections={() => {
              window.location.href = "/directions";
            }}
          />
        </div>
      )}

      {/* Bottom nav bar for mobile */}
      <div className="absolute bottom-0 left-0 right-0 z-40 sm:hidden bg-white border-t border-gray-200 flex items-center justify-around py-2 px-4">
        <Link
          href="/"
          className="flex flex-col items-center gap-0.5 text-blue-600"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          <span className="text-xs font-medium">Explore</span>
        </Link>
        <Link
          href="/directions"
          className="flex flex-col items-center gap-0.5 text-gray-500"
        >
          <Navigation className="w-5 h-5" />
          <span className="text-xs">Directions</span>
        </Link>
      </div>

      {/* Branding watermark */}
      <div className="absolute bottom-16 left-4 z-30 sm:bottom-4">
        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm border border-gray-100">
          <div className="flex gap-0.5">
            <span className="text-blue-500 font-bold text-sm">G</span>
            <span className="text-red-500 font-bold text-sm">o</span>
            <span className="text-yellow-500 font-bold text-sm">o</span>
            <span className="text-blue-500 font-bold text-sm">g</span>
            <span className="text-green-500 font-bold text-sm">l</span>
            <span className="text-red-500 font-bold text-sm">e</span>
          </div>
          <span className="text-gray-600 font-medium text-sm">Maps Clone</span>
        </div>
      </div>
    </main>
  );
}
