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

interface PinGroup {
  coordinates: [number, number];
  destinations: DestinationPin[];
}

// Group pins that are within threshold degrees of each other
function groupPins(destinations: DestinationPin[], threshold = 0.5): PinGroup[] {
  const groups: PinGroup[] = [];
  for (const dest of destinations) {
    const existing = groups.find(
      (g) =>
        Math.abs(g.coordinates[0] - dest.coordinates[0]) < threshold &&
        Math.abs(g.coordinates[1] - dest.coordinates[1]) < threshold
    );
    if (existing) {
      existing.destinations.push(dest);
    } else {
      groups.push({ coordinates: dest.coordinates, destinations: [dest] });
    }
  }
  return groups;
}

export default function WorldMap({ destinations }: { destinations: DestinationPin[] }) {
  const [selectedGroup, setSelectedGroup] = useState<PinGroup | null>(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([0, 20]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Re-group based on zoom — tighter grouping as you zoom in
  const threshold = Math.max(0.05, 0.5 / Math.sqrt(zoom));
  const groups = groupPins(destinations, threshold);

  function handlePin(group: PinGroup, e: React.MouseEvent) {
    if (selectedGroup?.coordinates === group.coordinates) {
      setSelectedGroup(null);
      return;
    }
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const rawX = e.clientX - rect.left + 12;
      const rawY = e.clientY - rect.top - 10;
      const x = Math.min(rawX, rect.width - 240);
      const y = Math.max(8, Math.min(rawY, rect.height - 200));
      setPopupPos({ x, y });
    }
    setSelectedGroup(group);
  }

  const pinR = Math.max(1.5, 7 / Math.sqrt(zoom));
  const strokeW = Math.max(0.3, 2 / Math.sqrt(zoom));
  const hitR = Math.max(pinR * 2, 8 / Math.sqrt(zoom));
  const isSelected = (g: PinGroup) => selectedGroup?.coordinates === g.coordinates;

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-[#dbeafe]"
    >
      {/* Zoom controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
        <button
          onClick={() => setZoom((z) => Math.min(z * 2, 128))}
          className="w-8 h-8 bg-white rounded-lg shadow border border-gray-200 text-gray-700 font-bold text-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
        >+</button>
        <button
          onClick={() => { setZoom((z) => Math.max(z / 2, 1)); }}
          className="w-8 h-8 bg-white rounded-lg shadow border border-gray-200 text-gray-700 font-bold text-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
        >−</button>
        {zoom > 1 && (
          <button
            onClick={() => { setZoom(1); setCenter([0, 20]); setSelectedGroup(null); }}
            className="w-8 h-8 bg-white rounded-lg shadow border border-gray-200 text-gray-500 text-[10px] font-bold hover:bg-gray-50 transition-colors flex items-center justify-center"
          >↺</button>
        )}
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

          {groups.map((group, i) => {
            const isStack = group.destinations.length > 1;
            const active = isSelected(group);
            return (
              <Marker
                key={i}
                coordinates={group.coordinates}
                onClick={(e: unknown) => handlePin(group, e as unknown as React.MouseEvent)}
              >
                <g className="cursor-pointer">
                  <circle r={hitR} fill="transparent" />
                  {active && <circle r={pinR * 2.5} fill="#1B4332" fillOpacity={0.2} />}
                  <circle
                    r={pinR}
                    fill={active ? "#C9A84C" : isStack ? "#7C3AED" : "#1B4332"}
                    stroke="#ffffff"
                    strokeWidth={strokeW}
                  />
                  {isStack && (
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={pinR * 1.1}
                      fontWeight="bold"
                      fill="white"
                      style={{ pointerEvents: "none" }}
                    >
                      {group.destinations.length}
                    </text>
                  )}
                  <title>{group.destinations.map((d) => d.name).join(", ")}</title>
                </g>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Popup */}
      {selectedGroup && (
        <div
          className="absolute z-20 bg-white rounded-xl shadow-xl border border-gray-100 p-4 w-56 pointer-events-auto"
          style={{ top: popupPos.y, left: popupPos.x }}
        >
          <button
            onClick={() => setSelectedGroup(null)}
            className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-xl leading-none"
            aria-label="Close"
          >×</button>

          {selectedGroup.destinations.length === 1 ? (
            // Single destination
            (() => {
              const dest = selectedGroup.destinations[0];
              return (
                <>
                  <p className="font-bold text-gray-900 pr-5 text-sm leading-tight">{dest.name}</p>
                  <p className="text-xs text-gray-400 mb-3">{dest.country}</p>
                  <div className="flex items-center justify-between mb-4 bg-forest rounded-xl px-4 py-3">
                    <div>
                      <p className="text-[10px] text-white/60 uppercase tracking-widest font-semibold">Overall Score</p>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-2xl font-bold text-white">{dest.overallScore}</span>
                        <span className="text-xs text-white/50">/10</span>
                      </div>
                    </div>
                    <span className="text-3xl">⛳</span>
                  </div>
                  <Link
                    href={`/destinations/${dest.slug}`}
                    className="block text-center text-xs font-semibold bg-forest text-white rounded-lg py-2 hover:bg-forest-dark transition-colors"
                  >
                    View Full Review →
                  </Link>
                </>
              );
            })()
          ) : (
            // Multiple destinations
            <>
              <p className="font-bold text-gray-900 pr-5 text-sm mb-1">{selectedGroup.destinations[0].country}</p>
              <p className="text-xs text-gray-400 mb-3">{selectedGroup.destinations.length} destinations here</p>
              <div className="space-y-2">
                {selectedGroup.destinations.map((dest) => (
                  <Link
                    key={dest.slug}
                    href={`/destinations/${dest.slug}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div>
                      <p className="text-xs font-semibold text-gray-900 group-hover:text-forest transition-colors leading-tight">{dest.name}</p>
                    </div>
                    <span className="text-xs font-bold text-forest shrink-0 ml-2">{dest.overallScore}/10</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs text-gray-600">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-forest inline-block" /> 1 destination</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" /> Multiple</span>
      </div>
    </div>
  );
}