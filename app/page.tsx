export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { prisma } from "@/lib/prisma";
import { DESTINATION_COORDINATES } from "@/lib/coordinates";
import type { DestinationPin } from "./components/WorldMap";
import Sidebar from "./components/Sidebar";

const WorldMap = dynamic(() => import("./components/WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[380px] rounded-2xl bg-blue-50 border border-gray-100 animate-pulse" />
  ),
});

const STATS = [
  { label: "Destinations", value: "50+" },
  { label: "Courses Played", value: "200+" },
  { label: "Countries", value: "30+" },
  { label: "Members", value: "1,000+" },
];

export default async function HomePage() {
  const destinations = await prisma.destination.findMany({
    where: { published: true },
    orderBy: { createdAt: "asc" },
  });

  const pins: DestinationPin[] = destinations
    .filter((d) => DESTINATION_COORDINATES[d.slug])
    .map((d) => ({
      slug: d.slug,
      name: d.name,
      country: d.country,
      golfScore: d.golfScore,
      foodScore: d.foodScore,
      hotelScore: d.hotelScore,
      overallScore: d.overallScore,
      coordinates: DESTINATION_COORDINATES[d.slug],
    }));

  return (
    <>
      <Nav />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="bg-forest text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-4">
            Golf Travel, Properly Reviewed
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
            The World&apos;s Best
            <br />
            Golf Travel Guides
          </h1>
          <p className="text-lg sm:text-xl text-white/75 max-w-2xl mx-auto mb-10">
            Real course reviews. Honest scores. For golfers who actually want to
            know where to go next.
          </p>
          <a
            href="#destinations"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-md bg-gold text-white font-semibold text-base hover:bg-gold-dark transition-colors"
          >
            Explore Destinations
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────── */}
      <section className="border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="text-3xl font-bold text-forest">{stat.value}</dt>
                <dd className="mt-1 text-sm font-medium text-gray-500 uppercase tracking-wide">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Map + Destination cards + Sidebar ─────────────────────── */}
      <section id="destinations" className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 items-start">

            {/* Main column */}
            <div className="flex-1 min-w-0">

              {/* World map */}
              <div className="mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
                  Where We&apos;ve Been
                </h2>
                <p className="text-gray-500 text-base mb-6">
                  Click a pin to explore the destination.
                </p>
                <WorldMap destinations={pins} />
              </div>

              {/* Destination cards */}
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
                  Featured Destinations
                </h2>
                <p className="text-gray-500 text-base mb-8">
                  Handpicked bucket-list courses, scored on golf, food, and hotel.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {destinations.map((dest) => (
                    <Link
                      key={dest.id}
                      href={`/destinations/${dest.slug}`}
                      className="group block"
                    >
                      <article className="h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                        <div className="relative h-48 w-full overflow-hidden">
                          <Image
                            src={dest.heroImage}
                            alt={dest.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          />
                          <div className="absolute top-3 right-3 flex flex-col items-center justify-center w-12 h-12 rounded-full bg-gold shadow-md">
                            <span className="text-white font-bold text-base leading-none">
                              {dest.overallScore}
                            </span>
                            <span className="text-white/80 text-[10px] leading-none">/10</span>
                          </div>
                        </div>
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-forest transition-colors">
                              {dest.name}
                            </h3>
                            <span className="shrink-0 text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2 py-0.5 mt-0.5">
                              {dest.country}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                            {dest.description}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <ScorePill label="Golf" score={dest.golfScore} />
                            <ScorePill label="Food" score={dest.foodScore} />
                            <ScorePill label="Hotel" score={dest.hotelScore} />
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Sidebar />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function ScorePill({ label, score }: { label: string; score: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-forest bg-forest/10 rounded-full px-2.5 py-1">
      {label}
      <span className="font-bold">{score}</span>
    </span>
  );
}
