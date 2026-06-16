"use client";

import { useState } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <aside className="w-[300px] shrink-0 hidden lg:block">
      <div className="sticky top-20 space-y-4">

        {/* Ad-free pill */}
        {!dismissed && (
          <div className="flex items-center justify-between gap-2 bg-gold/10 border border-gold/40 rounded-full px-4 py-2">
            <Link
              href="/upgrade"
              className="text-sm font-medium text-gold-dark hover:text-gold transition-colors truncate"
            >
              Go ad-free for $1/mo
            </Link>
            <button
              onClick={() => setDismissed(true)}
              aria-label="Dismiss"
              className="shrink-0 text-gold/60 hover:text-gold transition-colors text-xl leading-none"
            >
              ×
            </button>
          </div>
        )}

        {/* Placeholder ad unit */}
        <div className="h-64 bg-gray-100 rounded-xl flex flex-col items-center justify-center gap-1 border border-gray-200">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Ad
          </span>
          <span className="text-[10px] text-gray-300">300 × 256</span>
        </div>

        {/* Second ad unit */}
        <div className="h-52 bg-gray-100 rounded-xl flex flex-col items-center justify-center gap-1 border border-gray-200">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Ad
          </span>
          <span className="text-[10px] text-gray-300">300 × 208</span>
        </div>

      </div>
    </aside>
  );
}
