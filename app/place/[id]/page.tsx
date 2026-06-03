"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, MapPin, Star, Navigation, Share2, ExternalLink, Phone, Globe, Clock, Tag, Info, ChevronRight } from 'lucide-react';
import { Place } from "@/lib/types";
import { getPlaceById, searchResultToPlace } from "@/lib/nominatim";
import { getCategoryIcon, formatPlaceType, SAMPLE_PLACES } from "@/lib/places";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function PlaceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [place, setPlace] = useState<Place | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlace = async () => {
      setIsLoading(true);
      setError(null);

      // Check sample places first
      const sample = SAMPLE_PLACES.find((p) => p.id === id);
      if (sample) {
        setPlace(sample);
        setIsLoading(false);
        return;
      }

      // Parse OSM type and ID from the URL param (format: "way-12345" or "node-12345")
      const parts = id.split("-");
      if (parts.length >= 2) {
        const osmType = parts[0];
        const osmId = parts.slice(1).join("-");
        try {
          const result = await getPlaceById(osmType, osmId);
          if (result) {
            setPlace(searchResultToPlace(result));
          } else {
            setError("Place not found");
          }
        } catch {
          setError("Failed to load place details");
        }
      } else {
        setError("Invalid place ID");
      }

      setIsLoading(false);
    };

    if (id) loadPlace();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading place details...</p>
        </div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 p-8">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <Info className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-xl font-semibold text-gray-800">Place Not Found</h1>
        <p className="text-gray-500 text-sm text-center max-w-sm">
          {error || "We couldn't find details for this place. It may have been removed or the ID is invalid."}
        </p>
        <Link
          href="/"
          className="flex items-center gap-2 bg-blue-500 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Map
        </Link>
      </div>
    );
  }

  const miniMarker = [
    {
      id: place.id,
      position: { lat: place.lat, lng: place.lng },
      title: place.name,
      place,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-gray-900 text-base truncate">
              {place.name}
            </h1>
            <p className="text-xs text-gray-500 capitalize">
              {formatPlaceType(place.type)}
            </p>
          </div>
          <button className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {/* Hero card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Category banner */}
          <div className="h-40 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center relative">
            <span className="text-7xl">{getCategoryIcon(place.category)}</span>
            <div className="absolute bottom-3 left-4">
              <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full capitalize">
                {place.category}
              </span>
            </div>
          </div>

          <div className="p-5">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {place.name}
            </h2>

            {place.rating && (
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-gray-800">
                  {place.rating}
                </span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={
                        "w-4 h-4 " +
                        (star <= Math.round(place.rating || 0)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300")
                      }
                    />
                  ))}
                </div>
                {place.reviewCount && (
                  <span className="text-sm text-blue-500 hover:underline cursor-pointer">
                    {place.reviewCount.toLocaleString()} reviews
                  </span>
                )}
              </div>
            )}

            <div className="flex items-start gap-2 mb-4">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600 leading-relaxed">
                {place.address || place.displayName}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Link
                href="/directions"
                className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white text-sm font-medium py-2.5 rounded-full hover:bg-blue-600 transition-colors"
              >
                <Navigation className="w-4 h-4" />
                Directions
              </Link>
              <button className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 text-sm font-medium py-2.5 rounded-full hover:bg-gray-200 transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Mini map */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-52">
            <LeafletMap
              center={{ lat: place.lat, lng: place.lng }}
              zoom={15}
              mapType="standard"
              markers={miniMarker}
              className="w-full h-full"
            />
          </div>
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">
                {place.lat.toFixed(5)}, {place.lng.toFixed(5)}
              </span>
            </div>
            <Link
              href="/"
              className="text-sm text-blue-500 font-medium hover:text-blue-700 flex items-center gap-1"
            >
              View on map
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Details card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-800 text-sm">
              Place Details
            </h3>
          </div>

          <div className="divide-y divide-gray-50">
            <div className="flex items-start gap-3 px-5 py-4">
              <Tag className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Category</p>
                <p className="text-sm text-gray-800 capitalize">
                  {place.category} · {formatPlaceType(place.type)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 px-5 py-4">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Address</p>
                <p className="text-sm text-gray-800">
                  {place.address || place.displayName}
                </p>
              </div>
            </div>

            {place.phone && (
              <div className="flex items-center gap-3 px-5 py-4">
                <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                  <a
                    href={"tel:" + place.phone}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    {place.phone}
                  </a>
                </div>
              </div>
            )}

            {place.website && (
              <div className="flex items-center gap-3 px-5 py-4">
                <Globe className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Website</p>
                  <a
                    href={place.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline flex items-center gap-1"
                  >
                    {place.website}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {place.openingHours && (
              <div className="flex items-start gap-3 px-5 py-4">
                <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Hours</p>
                  <p className="text-sm text-gray-800">{place.openingHours}</p>
                </div>
              </div>
            )}

            {place.osmId && (
              <div className="flex items-center gap-3 px-5 py-4">
                <Info className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">OSM Reference</p>
                  <a
                    href={"https://www.openstreetmap.org/" + place.osmType + "/" + place.osmId}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline flex items-center gap-1"
                  >
                    View on OpenStreetMap
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Nearby section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-800 text-sm">
              Nearby Places
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {SAMPLE_PLACES.filter((p) => p.id !== place.id)
              .slice(0, 3)
              .map((nearby) => (
                <Link
                  key={nearby.id}
                  href={"/place/" + nearby.id}
                  className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-xl flex-shrink-0">
                    {getCategoryIcon(nearby.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {nearby.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {nearby.address}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </Link>
              ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-400">
            Data provided by{" "}
            <a
              href="https://www.openstreetmap.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              OpenStreetMap
            </a>{" "}
            contributors
          </p>
        </div>
      </div>
    </div>
  );
}
