"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Navigation, Layers, MapPin, Star, Coffee, Utensils, Hotel, ShoppingBag, Fuel, Hospital, ChevronRight, X } from 'lucide-react';
import MapTypeToggle from "@/components/MapTypeToggle";
import MapControls from "@/components/MapControls";
import PlaceInfoCard from "@/components/PlaceInfoCard";
import PlacesSearchBar from "@/components/PlacesSearchBar";
import { searchResultToPlace } from "@/lib/nominatim";
import { MapType, Place, Marker, LatLng, SearchResult } from "@/lib/types";
import { defaultCenter, defaultZoom } from "@/lib/mapLayers";
import { SAMPLE_PLACES, getCategoryIcon, formatPlaceType } from "@/lib/places";

const GoogleMap = dynamic(() => import('@/components/GoogleMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#e8eaed]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#4285F4] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Loading map…</p>
      </div>
    </div>
  ),
});

const QUICK_CATEGORIES = [
  { label: "Restaurants", icon: Utensils, color: "#EA4335", query: "restaurant" },
  { label: "Coffee", icon: Coffee, color: "#FBBC05", query: "cafe" },
  { label: "Hotels", icon: Hotel, color: "#4285F4", query: "hotel" },
  { label: "Shopping", icon: ShoppingBag, color: "#34A853", query: "shopping mall" },
  { label: "Gas", icon: Fuel, color: "#FF6D00", query: "gas station" },
  { label: "Hospital", icon: Hospital, color: "#EA4335", query: "hospital" },
];

export default function HomePage() {
  const [mapType, setMapType] = useState<MapType>("standard");
  const [center, setCenter] = useState<LatLng>(defaultCenter);
  const [zoom, setZoom] = useState(defaultZoom);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [sidebarMode, setSidebarMode] = useState<"none" | "results" | "place">("none");
  const [sidebarResults, setSidebarResults] = useState<SearchResult[]>([]);
  const [showPlaceCard, setShowPlaceCard] = useState(false);
  const [showMapTypeToggle, setShowMapTypeToggle] = useState(false);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handlePlaceSelect = useCallback((place: { name: string; lat: number; lng: number; address: string }) => {
    const newPlace: Place = {
      id: `google-${Date.now()}`,
      name: place.name,
      lat: place.lat,
      lng: place.lng,
      address: place.address,
      type: 'place',
    };
    setCenter({ lat: place.lat, lng: place.lng });
    setZoom(15);
    setMarkers([{ id: newPlace.id, position: { lat: place.lat, lng: place.lng }, title: place.name, place: newPlace }]);
    setSelectedPlace(newPlace);
    setShowPlaceCard(true);
    setSidebarMode('place');
  }, []);

  const flyToPlace = useCallback((place: Place) => {
    setCenter({ lat: place.lat, lng: place.lng });
    setZoom(16);
  }, []);

  const dropMarker = useCallback((place: Place) => {
    setMarkers([
      {
        id: place.id,
        position: { lat: place.lat, lng: place.lng },
        title: place.name,
        place,
      },
    ]);
  }, []);

  const handleSidebarItemClick = useCallback(
    (result: SearchResult) => {
      const place = searchResultToPlace(result);
      flyToPlace(place);
      dropMarker(place);
      setSelectedPlace(place);
      setShowPlaceCard(true);
      setSidebarMode("place");
    },
    [flyToPlace, dropMarker]
  );

  const handleMarkerClick = useCallback((marker: Marker) => {
    if (marker.place) {
      setSelectedPlace(marker.place);
      setShowPlaceCard(true);
      setSidebarMode("place");
    }
  }, []);

  const handleCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setZoom(15);
      },
      (err) => console.error("Geolocation error:", err)
    );
  }, []);

  const handleMapClick = useCallback((latlng: LatLng) => {
    const place: Place = {
      id: `pin-${Date.now()}`,
      name: "Dropped Pin",
      lat: latlng.lat,
      lng: latlng.lng,
      address: `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`,
      type: "place",
    };
    setMarkers([{ id: place.id, position: latlng, title: place.name, place }]);
    setSelectedPlace(place);
    setShowPlaceCard(true);
    setSidebarMode("place");
  }, []);

  const handleZoomIn = useCallback(() => setZoom((z) => Math.min(z + 1, 20)), []);
  const handleZoomOut = useCallback(() => setZoom((z) => Math.max(z - 1, 1)), []);

  const handleCategoryClick = useCallback((query: string) => {
    // Category search — could be extended with Places API nearby search
    console.log("Category search:", query);
  }, []);

  const handleClosePlaceCard = useCallback(() => {
    setShowPlaceCard(false);
    setSelectedPlace(null);
    if (sidebarMode === "place") setSidebarMode("none");
  }, [sidebarMode]);

  const handleCloseSidebar = useCallback(() => {
    setSidebarMode("none");
    setShowPlaceCard(false);
    setSelectedPlace(null);
    setMarkers([]);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#e8eaed]">
      {/* ── Map ── */}
      <div className="absolute inset-0">
        <GoogleMap
          center={center}
          zoom={zoom}
          markers={markers}
          onMapClick={handleMapClick}
          className="w-full h-full"
        />
      </div>

      {/* ── Top bar ── */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-start gap-3 pointer-events-none">
        {/* Search pill */}
        <div className="flex-1 max-w-md pointer-events-auto">
          <PlacesSearchBar
            onPlaceSelect={handlePlaceSelect}
            placeholder="Search Maps"
            className="w-full max-w-md"
          />
        </div>

        {/* Map-type toggle button */}
        <div className="pointer-events-auto relative">
          <button
            onClick={() => setShowMapTypeToggle((v) => !v)}
            className="w-10 h-10 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.2)] flex items-center justify-center hover:bg-gray-50 transition-colors"
            title="Map type"
          >
            <Layers className="w-5 h-5 text-gray-600" />
          </button>
          {showMapTypeToggle && (
            <div className="absolute top-12 right-0">
              <MapTypeToggle
                current={mapType}
                onChange={(t) => {
                  setMapType(t);
                  setShowMapTypeToggle(false);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Quick categories ── */}
      <div className="absolute top-20 left-4 z-20 flex gap-2 overflow-x-auto pb-1 pointer-events-auto">
        {QUICK_CATEGORIES.map(({ label, icon: Icon, color, query }) => (
          <button
            key={label}
            onClick={() => handleCategoryClick(query)}
            className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.15)] text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            <Icon className="w-3.5 h-3.5" style={{ color }} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Sidebar ── */}
      {sidebarMode === "results" && sidebarResults.length > 0 && (
        <div className="absolute top-0 left-0 bottom-0 w-80 bg-white shadow-xl z-30 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 text-sm">
              {sidebarResults.length} results
            </h2>
            <button
              onClick={handleCloseSidebar}
              className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {sidebarResults.map((r, i) => {
              const parts = r.display_name.split(",");
              const name = parts[0]?.trim();
              const sub = parts.slice(1, 3).join(", ").trim();
              return (
                <button
                  key={r.place_id + "-" + i}
                  onClick={() => handleSidebarItemClick(r)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50"
                >
                  <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-[#EA4335]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">{name}</p>
                    {sub && <p className="text-xs text-gray-400 truncate">{sub}</p>}
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Place info card ── */}
      {showPlaceCard && selectedPlace && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-sm px-4 pointer-events-auto">
          <PlaceInfoCard
            place={selectedPlace}
            onClose={handleClosePlaceCard}
            onDirections={() => {
              window.location.href = `/directions?to=${selectedPlace.lat},${selectedPlace.lng}&toName=${encodeURIComponent(selectedPlace.name)}`;
            }}
          />
        </div>
      )}

      {/* ── Map controls ── */}
      <div className="absolute bottom-24 right-4 z-20 pointer-events-auto">
        <MapControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onCurrentLocation={handleCurrentLocation}
        />
      </div>

      {/* ── Directions FAB ── */}
      <Link
        href="/directions"
        className="absolute bottom-6 right-4 z-20 flex items-center gap-2 bg-[#4285F4] text-white px-4 py-2.5 rounded-full shadow-lg hover:bg-[#3367d6] transition-colors text-sm font-medium"
      >
        <Navigation className="w-4 h-4" />
        Directions
      </Link>
    </div>
  );
}
