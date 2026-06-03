"use client";

import { useState, useCallback } from "react";
import { Route, SearchResult } from "@/lib/types";
import { searchPlaces, searchResultToPlace } from "@/lib/nominatim";
import { getRoute } from "@/lib/routing";

export function useDirections() {
  const [origin, setOrigin] = useState<SearchResult | null>(null);
  const [destination, setDestination] = useState<SearchResult | null>(null);
  const [originQuery, setOriginQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");
  const [originResults, setOriginResults] = useState<SearchResult[]>([]);
  const [destinationResults, setDestinationResults] = useState<SearchResult[]>([]);
  const [route, setRoute] = useState<Route | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchOrigin = useCallback(async (query: string) => {
    setOriginQuery(query);
    if (query.trim().length < 2) {
      setOriginResults([]);
      return;
    }
    const results = await searchPlaces(query);
    setOriginResults(results);
  }, []);

  const searchDestination = useCallback(async (query: string) => {
    setDestinationQuery(query);
    if (query.trim().length < 2) {
      setDestinationResults([]);
      return;
    }
    const results = await searchPlaces(query);
    setDestinationResults(results);
  }, []);

  const selectOrigin = useCallback((result: SearchResult) => {
    setOrigin(result);
    setOriginQuery(result.display_name.split(",")[0]);
    setOriginResults([]);
  }, []);

  const selectDestination = useCallback((result: SearchResult) => {
    setDestination(result);
    setDestinationQuery(result.display_name.split(",")[0]);
    setDestinationResults([]);
  }, []);

  const calculateRoute = useCallback(async () => {
    if (!origin || !destination) {
      setError("Please select both origin and destination");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const originPlace = searchResultToPlace(origin);
      const destPlace = searchResultToPlace(destination);

      const routeData = await getRoute(
        { lat: originPlace.lat, lng: originPlace.lng },
        { lat: destPlace.lat, lng: destPlace.lng }
      );

      if (!routeData) {
        setError("Could not find a route between these locations");
      } else {
        setRoute(routeData);
      }
    } catch {
      setError("Failed to calculate route. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [origin, destination]);

  const clearRoute = useCallback(() => {
    setRoute(null);
    setOrigin(null);
    setDestination(null);
    setOriginQuery("");
    setDestinationQuery("");
    setError(null);
  }, []);

  return {
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
  };
}
