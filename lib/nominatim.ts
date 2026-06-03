import { SearchResult, Place } from "./types";

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

export async function searchPlaces(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const params = new URLSearchParams();
    params.set("q", query);
    params.set("format", "json");
    params.set("addressdetails", "1");
    params.set("limit", "8");
    params.set("accept-language", "en");

    const res = await fetch(NOMINATIM_BASE + "/search?" + params.toString(), {
      headers: {
        "User-Agent": "MapApp/1.0 (educational project)",
      },
    });

    if (!res.ok) throw new Error("Search failed");
    const data: SearchResult[] = await res.json();
    return data;
  } catch (err) {
    console.error("Nominatim search error:", err);
    return [];
  }
}

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<SearchResult | null> {
  try {
    const params = new URLSearchParams();
    params.set("lat", lat.toString());
    params.set("lon", lng.toString());
    params.set("format", "json");
    params.set("addressdetails", "1");
    params.set("accept-language", "en");

    const res = await fetch(
      NOMINATIM_BASE + "/reverse?" + params.toString(),
      {
        headers: {
          "User-Agent": "MapApp/1.0 (educational project)",
        },
      }
    );

    if (!res.ok) throw new Error("Reverse geocode failed");
    const data: SearchResult = await res.json();
    return data;
  } catch (err) {
    console.error("Reverse geocode error:", err);
    return null;
  }
}

export async function getPlaceById(
  osmType: string,
  osmId: string
): Promise<SearchResult | null> {
  try {
    const prefix = osmType.charAt(0).toUpperCase();
    const url =
      NOMINATIM_BASE +
      "/lookup?osm_ids=" +
      prefix +
      osmId +
      "&format=json&addressdetails=1";

    const res = await fetch(url, {
      headers: {
        "User-Agent": "MapApp/1.0 (educational project)",
      },
    });

    if (!res.ok) throw new Error("Place lookup failed");
    const data: SearchResult[] = await res.json();
    return data[0] || null;
  } catch (err) {
    console.error("Place lookup error:", err);
    return null;
  }
}

export function searchResultToPlace(result: SearchResult): Place {
  const nameParts = result.display_name.split(",");
  return {
    id: result.osm_type + "-" + result.osm_id,
    name: nameParts[0]?.trim() || result.display_name,
    displayName: result.display_name,
    address: nameParts.slice(1).join(",").trim(),
    lat: parseFloat(result.lat),
    lng: parseFloat(result.lon),
    type: result.type,
    category: result.class,
    osmId: result.osm_id?.toString(),
    osmType: result.osm_type,
    importance: result.importance,
    icon: result.icon,
    boundingBox: result.boundingbox
      ? [
          parseFloat(result.boundingbox[0]),
          parseFloat(result.boundingbox[1]),
          parseFloat(result.boundingbox[2]),
          parseFloat(result.boundingbox[3]),
        ]
      : undefined,
  };
}
