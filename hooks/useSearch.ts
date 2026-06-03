"use client";

import { useState, useCallback, useRef } from "react";
import { SearchResult } from "@/lib/types";
import { searchPlaces } from "@/lib/nominatim";

export function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (value: string) => {
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!value || value.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await searchPlaces(value);
        setResults(data);
        setIsOpen(data.length > 0);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 400);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    query,
    results,
    isLoading,
    isOpen,
    search,
    clearSearch,
    closeDropdown,
    setQuery,
  };
}
