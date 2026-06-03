export interface LatLng {
  lat: number;
  lng: number;
}

export interface Place {
  id: string;
  name: string;
  displayName: string;
  address: string;
  lat: number;
  lng: number;
  type: string;
  category: string;
  osmId?: string;
  osmType?: string;
  importance?: number;
  icon?: string;
  boundingBox?: [number, number, number, number];
  phone?: string;
  website?: string;
  openingHours?: string;
  rating?: number;
  reviewCount?: number;
  photos?: string[];
  tags?: Record<string, string>;
}

export interface SearchResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  icon?: string;
  address?: {
    road?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
    house_number?: string;
    suburb?: string;
    county?: string;
  };
}

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  type: number;
  name: string;
  way_points: [number, number];
}

export interface Route {
  distance: number;
  duration: number;
  geometry: {
    coordinates: [number, number][];
    type: string;
  };
  legs: {
    steps: RouteStep[];
    distance: number;
    duration: number;
    summary: string;
  }[];
  summary: {
    distance: number;
    duration: number;
  };
}

export interface MapLayer {
  id: string;
  name: string;
  url: string;
  attribution: string;
  maxZoom: number;
}

export type MapType = "standard" | "satellite" | "terrain";

export interface Marker {
  id: string;
  position: LatLng;
  title: string;
  description?: string;
  type?: string;
  place?: Place;
}
