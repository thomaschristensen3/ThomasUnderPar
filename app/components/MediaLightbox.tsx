"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { MediaItem } from "@/types/destination";

export default function MediaGrid({ items }: { items: MediaItem[] }) {
  const [selected, setSelected] = useState<MediaItem | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelected(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className={`grid gap-3 mb-6 ${items.length === 1 ? "grid-cols-1" : items.length === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}>
        {items.map((item, i) => (
          <div
            key={i}
            className="relative rounded-xl overflow-hidden bg-gray-100 aspect-video group cursor-pointer"
            onClick={() => setSelected(item)}
          >
            {item.type === "image" ? (
              <>
                <Image
                  src={item.url}
                  alt={item.caption || ""}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                {item.caption && (
                  <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs px-3 py-1.5 backdrop-blur-sm">
                    {item.caption}
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <div className="flex flex-col items-center gap-2 text-white">
                  <div className="w-14 h-14 rounded-full bg-forest/90 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-700">{item.caption || "Watch video"}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl leading-none hover:text-gray-300 transition-colors"
            onClick={() => setSelected(null)}
          >
            ×
          </button>
          <div
            className="relative max-w-5xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {selected.type === "image" ? (
              <div className="relative w-full" style={{ maxHeight: "85vh" }}>
                <Image
                  src={selected.url}
                  alt={selected.caption || ""}
                  width={1200}
                  height={800}
                  className="object-contain rounded-xl max-h-[85vh] w-auto mx-auto"
                />
                {selected.caption && (
                  <p className="text-white text-sm text-center mt-3 opacity-75">{selected.caption}</p>
                )}
              </div>
            ) : (
              <div className="w-full">
                <video
                  src={selected.url}
                  controls
                  autoPlay
                  className="rounded-xl max-h-[85vh] w-full"
                />
                {selected.caption && (
                  <p className="text-white text-sm text-center mt-3 opacity-75">{selected.caption}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}