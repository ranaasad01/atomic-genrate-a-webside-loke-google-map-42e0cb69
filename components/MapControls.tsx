"use client";

import { Plus, Minus, Navigation, Layers } from 'lucide-react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCurrentLocation: () => void;
}

export default function MapControls({
  onZoomIn,
  onZoomOut,
  onCurrentLocation,
}: MapControlsProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Zoom controls */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <button
          onClick={onZoomIn}
          className="flex items-center justify-center w-10 h-10 hover:bg-gray-50 transition-colors border-b border-gray-100"
          title="Zoom in"
        >
          <Plus className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={onZoomOut}
          className="flex items-center justify-center w-10 h-10 hover:bg-gray-50 transition-colors"
          title="Zoom out"
        >
          <Minus className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Current location */}
      <button
        onClick={onCurrentLocation}
        className="flex items-center justify-center w-10 h-10 bg-white rounded-xl shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        title="My location"
      >
        <Navigation className="w-5 h-5 text-blue-500" />
      </button>
    </div>
  );
}
