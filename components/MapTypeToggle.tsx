"use client";

import { MapType } from "@/lib/types";
import { Map, Satellite, Mountain } from 'lucide-react';

interface MapTypeToggleProps {
  current: MapType;
  onChange: (type: MapType) => void;
}

const types: { id: MapType; label: string; emoji: string }[] = [
  { id: "standard", label: "Map", emoji: "🗺️" },
  { id: "satellite", label: "Satellite", emoji: "🛰️" },
  { id: "terrain", label: "Terrain", emoji: "⛰️" },
];

export default function MapTypeToggle({ current, onChange }: MapTypeToggleProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
      {types.map((type) => (
        <button
          key={type.id}
          onClick={() => onChange(type.id)}
          className={
            "flex flex-col items-center justify-center px-3 py-2.5 text-xs font-medium transition-colors border-b border-gray-100 last:border-0 " +
            (current === type.id
              ? "bg-blue-50 text-blue-600"
              : "text-gray-600 hover:bg-gray-50")
          }
        >
          <span className="text-lg leading-none mb-0.5">{type.emoji}</span>
          <span>{type.label}</span>
        </button>
      ))}
    </div>
  );
}
