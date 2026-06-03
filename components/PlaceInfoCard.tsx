"use client";

import { X, MapPin, Star, ExternalLink, Navigation, Share2 } from 'lucide-react';
import { Place } from "@/lib/types";
import { getCategoryIcon, formatPlaceType } from "@/lib/places";
import Link from "next/link";

interface PlaceInfoCardProps {
  place: Place;
  onClose: () => void;
  onDirections?: () => void;
}

export default function PlaceInfoCard({
  place,
  onClose,
  onDirections,
}: PlaceInfoCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-80 max-w-full">
      {/* Header image area */}
      <div className="relative h-36 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
        <span className="text-5xl">{getCategoryIcon(place.category)}</span>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-base leading-tight mb-1">
          {place.name}
        </h3>

        <div className="flex items-center gap-2 mb-2">
          {place.rating && (
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-800">
                {place.rating}
              </span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={
                      "w-3 h-3 " +
                      (star <= Math.round(place.rating || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300")
                    }
                  />
                ))}
              </div>
              {place.reviewCount && (
                <span className="text-xs text-gray-500">
                  ({place.reviewCount.toLocaleString()})
                </span>
              )}
            </div>
          )}
          <span className="text-xs text-gray-500 capitalize">
            {formatPlaceType(place.type)}
          </span>
        </div>

        <div className="flex items-start gap-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
            {place.address || place.displayName}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={onDirections}
            className="flex-1 flex items-center justify-center gap-1.5 bg-blue-500 text-white text-xs font-medium py-2 px-3 rounded-full hover:bg-blue-600 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" />
            Directions
          </button>
          <Link
            href={"/place/" + place.osmType + "-" + place.osmId}
            className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-medium py-2 px-3 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Details
          </Link>
          <button className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <Share2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
