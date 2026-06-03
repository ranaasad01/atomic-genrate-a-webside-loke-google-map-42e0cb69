import { Route, LatLng } from "./types";

const OSRM_BASE = "https://router.project-osrm.org/route/v1/driving";

export async function getRoute(
  origin: LatLng,
  destination: LatLng
): Promise<Route | null> {
  try {
    const coords =
      origin.lng +
      "," +
      origin.lat +
      ";" +
      destination.lng +
      "," +
      destination.lat;
    const url =
      OSRM_BASE +
      "/" +
      coords +
      "?overview=full&geometries=geojson&steps=true&annotations=false";

    const res = await fetch(url);
    if (!res.ok) throw new Error("Routing failed");

    const data = await res.json();
    if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
      throw new Error("No route found");
    }

    const route = data.routes[0];
    return {
      distance: route.distance,
      duration: route.duration,
      geometry: route.geometry,
      legs: route.legs,
      summary: {
        distance: route.distance,
        duration: route.duration,
      },
    };
  } catch (err) {
    console.error("Routing error:", err);
    return null;
  }
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return Math.round(meters) + " m";
  }
  return (meters / 1000).toFixed(1) + " km";
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return hours + " hr " + minutes + " min";
  }
  return minutes + " min";
}

export function getStepIcon(type: number): string {
  const icons: Record<number, string> = {
    0: "↑",
    1: "↗",
    2: "→",
    3: "↘",
    4: "↓",
    5: "↙",
    6: "←",
    7: "↖",
    8: "↑",
    10: "↑",
    11: "↑",
    12: "↑",
  };
  return icons[type] || "↑";
}
