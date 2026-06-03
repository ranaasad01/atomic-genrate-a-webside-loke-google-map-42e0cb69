"use client";

import { useEffect, useRef, useState } from "react";
import { MapType, Marker, LatLng } from "@/lib/types";
import { mapLayers, defaultCenter, defaultZoom } from "@/lib/mapLayers";

interface LeafletMapProps {
  center?: LatLng;
  zoom?: number;
  mapType?: MapType;
  markers?: Marker[];
  routeCoords?: [number, number][];
  onMapClick?: (latlng: LatLng) => void;
  onMarkerClick?: (marker: Marker) => void;
  className?: string;
}

export default function LeafletMap({
  center = defaultCenter,
  zoom = defaultZoom,
  mapType = "standard",
  markers = [],
  routeCoords,
  onMapClick,
  onMarkerClick,
  className = "",
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const routeLayerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      // Fix default icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [center.lat, center.lng],
        zoom: zoom,
        zoomControl: false,
      });

      const layer = mapLayers[mapType];
      tileLayerRef.current = L.tileLayer(layer.url, {
        attribution: layer.attribution,
        maxZoom: layer.maxZoom,
      }).addTo(map);

      if (onMapClick) {
        map.on("click", (e: any) => {
          onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
        });
      }

      mapInstanceRef.current = map;
      setIsLoaded(true);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update tile layer when mapType changes
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    const updateLayer = async () => {
      const L = (await import("leaflet")).default;
      if (tileLayerRef.current) {
        tileLayerRef.current.remove();
      }
      const layer = mapLayers[mapType];
      tileLayerRef.current = L.tileLayer(layer.url, {
        attribution: layer.attribution,
        maxZoom: layer.maxZoom,
      }).addTo(mapInstanceRef.current);
    };

    updateLayer();
  }, [mapType, isLoaded]);

  // Update center/zoom
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;
    mapInstanceRef.current.setView([center.lat, center.lng], zoom, {
      animate: true,
    });
  }, [center.lat, center.lng, zoom, isLoaded]);

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    const updateMarkers = async () => {
      const L = (await import("leaflet")).default;

      // Clear existing markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      markers.forEach((marker) => {
        const blueIcon = L.divIcon({
          html: `<div style="
            width: 28px;
            height: 28px;
            background: #4285F4;
            border: 3px solid white;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          "></div>`,
          className: "",
          iconSize: [28, 28],
          iconAnchor: [14, 28],
          popupAnchor: [0, -30],
        });

        const m = L.marker([marker.position.lat, marker.position.lng], {
          icon: blueIcon,
        }).addTo(mapInstanceRef.current);

        if (marker.title) {
          m.bindTooltip(marker.title, { permanent: false, direction: "top" });
        }

        if (onMarkerClick) {
          m.on("click", () => onMarkerClick(marker));
        }

        markersRef.current.push(m);
      });
    };

    updateMarkers();
  }, [markers, isLoaded, onMarkerClick]);

  // Update route
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    const updateRoute = async () => {
      const L = (await import("leaflet")).default;

      if (routeLayerRef.current) {
        routeLayerRef.current.remove();
        routeLayerRef.current = null;
      }

      if (routeCoords && routeCoords.length > 0) {
        const latlngs = routeCoords.map(([lng, lat]) => [lat, lng] as [number, number]);
        routeLayerRef.current = L.polyline(latlngs, {
          color: "#4285F4",
          weight: 5,
          opacity: 0.8,
          lineJoin: "round",
        }).addTo(mapInstanceRef.current);

        mapInstanceRef.current.fitBounds(routeLayerRef.current.getBounds(), {
          padding: [50, 50],
        });
      }
    };

    updateRoute();
  }, [routeCoords, isLoaded]);

  return (
    <div className={"relative w-full h-full " + className}>
      <div ref={mapRef} className="w-full h-full" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm font-medium">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}
