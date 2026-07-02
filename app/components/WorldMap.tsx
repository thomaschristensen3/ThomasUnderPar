"use client";

import { useState, useRef } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import Link from "next/link";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

export interface DestinationPin {
  slug: string;
  name: string;
  country: string;
  continent: string;
  overallScore: number;
  coordinates: [number, number];
}

interface GeoFeature {
  rsmKey: string;
  [key: string]: unknown;
}

const CONTINENTS = [
  { label: "World", center: [0, 20] as [number, number], zoom: 1 },
  { label: "Europe", center: [15, 52] as [number, number], zoom: 8 },
  { label: "N. America", center: [-95, 45] as [number, number], zoom: 4 },
  { label: "Asia", center: [100, 35] as [number, number], zoom: 4 },
  { label: "Oceania", center: [140, -25] as [number, number], zoom: 5 },
  { label: "Africa", center: [20, 5] as [number, number], zoom: 4 },
  { label: "S. America", center: [-60, -15] as [number, number], zoom: 4 },
];

export default function WorldMap({ destinations }: { destinations: DestinationPin[] }) {
  const [selected, setSelected] = useState<DestinationPin | null>(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([0, 20]);
  const containerRef = useRef<HTMLDivElement>(null);

  function handlePin(dest: DestinationPin, e: React.MouseEvent) {
    if (selected?.slug === dest.slug) {
      setSelected(null);
      return;
    }
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const rawX = e.clientX - rect.left + 12;
      const rawY = e.clientY - rect.top - 10;
      const x = Math.min(rawX, rect.width - 240);
      const y = Math.max(8, Math.min(rawY, rect.height - 160));
      setPopupPos({ x, y });
    }
    setSelected(dest);
  }

  // Pins shrink as you zoom in so they don't overlap
  const pinR = Math.max(1.5, 7 / Math.sqrt(zoom));
  const strokeW = Math.max(0.3, 2 / Math.sqrt(zoom));
  // Invisible hit area stays large enough to click
  const hitR = Math.max(pinR * 2, 6 / Math.sqrt(zoom));

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-[#dbeafe]"
    >
      {/* Continent shortcuts */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1 max-w-[55%]">
        {CONTINENTS.map((c) => (
          <button
            key={c.label}
            onClick={() => { setCenter(c.center); setZoom(c.zoom); setSelected(null); }}
            className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-semibold text-gray-600 border border-gray-200 hover:bg-white hover:text-forest transition-colors shadow-sm"
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Zoom controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
        <button
          onClick={() => setZoom((z) => Math.min(z * 2, 128))}
          className="w-8 h-8 bg-white rounded-lg shadow border border-gray-200 text-gray-700 font-bold text-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
        >+</button>
        <button
          onClick={() => setZoom((z) => Math.max(z / 2, 1))}
          className="w-8 h-8 bg-white rounded-lg shadow border border-gray-200 text-gray-700 font-bold text-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
        >−</button>
      </div>

      <ComposableMap
        projectionConfig={{ scale: 147, rotate: [-10, 0, 0] }}
        width={800}
        height={380}
        className="w-full h-auto"
      >
        <ZoomableGroup
          zoom={zoom}
          center={center}
          onMoveEnd={({ zoom: z, coordinates }: { zoom: number; coordinates: [number, number] }) => {
            setZoom(z);
            setCenter(coordinates);
          }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: GeoFeature[] }) =>
              geographies.map((geo: GeoFeature) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#d1fae5"
                  stroke="#ffffff"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#a7f3d0", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {destinations.map((dest) => (
            <Marker
              key={dest.slug}
              coordinates={dest.coordinates}
              onClick={(e: unknown) => handlePin(dest, e as unknown as React.MouseEvent)}
            >
              <g className="cursor-pointer">
                {/* Invisible larger hit area */}
                <circle r={hitR} fill="transparent" />
                {selected?.slug === dest.slug && (
                  <circle r={pinR * 2.5} fill="#1B4332" fillOpacity={0.2} />
                )}
                <circle
                  r={pinR}
                  fill={selected?.slug === dest.slug ? "#C9A84C" : "#1B4332"}
                  stroke="#ffffff"
                  strokeWidth={strokeW}
                />
                <title>{dest.name}</title>
              </g>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {/* Popup */}
      {selected && (
        <div
          className="absolute z-20 bg-white rounded-xl shadow-xl border border-gray-100 p-4 w-56 pointer-events-auto"
          style={{ top: popupPos.y, left: popupPos.x }}
        >
          <button
            onClick={() => setSelected(null)}
            className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-xl leading-none"
            aria-label="Close"
          >×</button>
          <p className="font-bold text-gray-900 pr-5 text-sm leading-tight">{selected.name}</p>
          <p className="text-xs text-gray-400 mb-3">{selected.country}</p>
          <div className="flex items-center justify-between mb-4 bg-forest rounded-xl px-4 py-3">
            <div>
              <p className="text-[10px] text-white/60 uppercase tracking-widest font-semibold">Overall Score</p>
              <div className="flex items-baseline gap-0.5">
                <span className="text-2xl font-bold text-white">{selected.overallScore}</span>
                <span className="text-xs text-white/50">/10</span>
              </div>
            </div>
            <span className="text-3xl">⛳</span>
          </div>
          <Link
            href={`/destinations/${selected.slug}`}
            className="block text-center text-xs font-semibold bg-forest text-white rounded-lg py-2 hover:bg-forest-dark transition-colors"
          >
            View Full Review →
          </Link>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs text-gray-600">
        <span className="w-2.5 h-2.5 rounded-full bg-forest inline-block" />
        Scroll or +/− to zoom · Drag to pan · Click a pin
      </div>
    </div>
  );
}