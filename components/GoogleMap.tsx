"use client";

import { useRef, useEffect } from "react";

interface GoogleMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  markers?: Array<{ id: string; position: { lat: number; lng: number }; title: string }>;
  onMapClick?: (latlng: { lat: number; lng: number }) => void;
  className?: string;
}

export default function GoogleMap({
  center,
  zoom,
  markers = [],
  onMapClick,
  className,
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerInstancesRef = useRef<google.maps.Marker[]>([]);
  const clickListenerRef = useRef<google.maps.MapsEventListener | null>(null);

  // Effect 1: Initialize the map
  useEffect(() => {
    if (!window.google || !window.google.maps || !mapRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
      mapTypeId: "roadmap",
      disableDefaultUI: false,
      zoomControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    });

    mapInstanceRef.current = map;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect 2: Update center and zoom when props change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.panTo(center);
    map.setZoom(zoom);
  }, [center, zoom]);

  // Effect 3: Manage markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markerInstancesRef.current.forEach((m) => m.setMap(null));
    markerInstancesRef.current = [];

    // Add new markers
    markers.forEach((markerData) => {
      const marker = new window.google.maps.Marker({
        position: markerData.position,
        map,
        title: markerData.title,
      });
      markerInstancesRef.current.push(marker);
    });

    return () => {
      markerInstancesRef.current.forEach((m) => m.setMap(null));
      markerInstancesRef.current = [];
    };
  }, [markers]);

  // Effect 4: Manage click listener
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove previous listener
    if (clickListenerRef.current) {
      window.google.maps.event.removeListener(clickListenerRef.current);
      clickListenerRef.current = null;
    }

    if (onMapClick) {
      clickListenerRef.current = map.addListener(
        "click",
        (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            onMapClick({ lat: e.latLng.lat(), lng: e.latLng.lng() });
          }
        }
      );
    }

    return () => {
      if (clickListenerRef.current) {
        window.google.maps.event.removeListener(clickListenerRef.current);
        clickListenerRef.current = null;
      }
    };
  }, [onMapClick]);

  return (
    <div
      ref={mapRef}
      className={className ?? "w-full h-full"}
    />
  );
}
