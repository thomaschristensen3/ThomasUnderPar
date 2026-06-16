"use client";

import { useState, useRef } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import Link from "next/link";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export interface DestinationPin {
  slug: string;
  name: string;
  country: string;
  golfScore: number;
  foodScore: number;
  hotelScore: number;
  overallScore: number;
  coordinates: [number, number];
}

export default function WorldMap({ destinations }: { destinations: DestinationPin[] }) {
  const [selected, setSelected] = useState<DestinationPin | null>(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
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
      // Keep popup within container bounds (popup is ~224px wide, ~200px tall)
      const x = Math.min(rawX, rect.width - 236);
      const y = Math.max(8, Math.min(rawY, rect.height - 210));
      setPopupPos({ x, y });
    }
    setSelected(dest);
  }

  return (
    <div ref={containerRef} className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-[#dbeafe]">
      <ComposableMap
        projectionConfig={{ scale: 147, rotate: [-10, 0, 0] }}
        width={800}
        height={380}
        className="w-full h-auto"
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
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
            onClick={(e) => handlePin(dest, e as unknown as React.MouseEvent)}
          >
            <g className="cursor-pointer">
              {/* Outer glow ring for selected pin */}
              {selected?.slug === dest.slug && (
                <circle r={14} fill="#1B4332" fillOpacity={0.2} />
              )}
              <circle
                r={7}
                fill={selected?.slug === dest.slug ? "#C9A84C" : "#1B4332"}
                stroke="#ffffff"
                strokeWidth={2}
              />
            </g>
          </Marker>
        ))}
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
            aria-label="Close popup"
          >
            ×
          </button>
          <p className="font-bold text-gray-900 pr-5 text-sm">{selected.name}</p>
          <p className="text-xs text-gray-400 mb-3">{selected.country}</p>

          <dl className="grid grid-cols-2 gap-y-1.5 text-xs mb-4">
            {[
              ["Golf", selected.golfScore],
              ["Food", selected.foodScore],
              ["Hotel", selected.hotelScore],
              ["Overall", selected.overallScore],
            ].map(([label, score]) => (
              <div key={label as string} className="flex justify-between pr-2">
                <dt className="text-gray-400">{label}</dt>
                <dd className="font-semibold text-forest">{score}/10</dd>
              </div>
            ))}
          </dl>

          <Link
            href={`/destinations/${selected.slug}`}
            className="block text-center text-xs font-semibold bg-forest text-white rounded-lg py-2 hover:bg-forest-dark transition-colors"
          >
            View Destination →
          </Link>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs text-gray-600">
        <span className="w-2.5 h-2.5 rounded-full bg-forest inline-block" />
        Click a pin for details
      </div>
    </div>
  );
}
