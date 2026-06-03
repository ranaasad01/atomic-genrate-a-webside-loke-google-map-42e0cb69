import { Place } from "./types";

export const CATEGORY_ICONS: Record<string, string> = {
  amenity: "🏛️",
  shop: "🛍️",
  tourism: "🏛️",
  natural: "🌿",
  highway: "🛣️",
  building: "🏢",
  leisure: "🎭",
  sport: "⚽",
  historic: "🏰",
  office: "🏢",
  place: "📍",
  boundary: "🗺️",
  landuse: "🌍",
  waterway: "💧",
  railway: "🚂",
  aeroway: "✈️",
  default: "📍",
};

export const CATEGORY_COLORS: Record<string, string> = {
  amenity: "#4285F4",
  shop: "#FBBC05",
  tourism: "#34A853",
  natural: "#34A853",
  highway: "#EA4335",
  building: "#9E9E9E",
  leisure: "#FF6D00",
  historic: "#795548",
  default: "#4285F4",
};

export function getCategoryIcon(category: string): string {
  return CATEGORY_ICONS[category] || CATEGORY_ICONS.default;
}

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.default;
}

export function formatPlaceType(type: string): string {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const SAMPLE_PLACES: Place[] = [
  {
    id: "sample-1",
    name: "Central Park",
    displayName: "Central Park, Manhattan, New York City, New York, USA",
    address: "Manhattan, New York City, New York, USA",
    lat: 40.7851,
    lng: -73.9683,
    type: "park",
    category: "leisure",
    rating: 4.8,
    reviewCount: 125000,
    photos: ["/images/central-park-new-york.jpg"],
  },
  {
    id: "sample-2",
    name: "Empire State Building",
    displayName: "Empire State Building, 350 5th Ave, New York, NY 10118, USA",
    address: "350 5th Ave, New York, NY 10118, USA",
    lat: 40.7484,
    lng: -73.9967,
    type: "attraction",
    category: "tourism",
    rating: 4.7,
    reviewCount: 89000,
    photos: ["/images/empire-state-building-nyc.jpg"],
  },
  {
    id: "sample-3",
    name: "Times Square",
    displayName: "Times Square, Manhattan, New York City, New York, USA",
    address: "Manhattan, New York City, New York, USA",
    lat: 40.758,
    lng: -73.9855,
    type: "square",
    category: "tourism",
    rating: 4.6,
    reviewCount: 210000,
    photos: ["/images/times-square-manhattan.jpg"],
  },
];
