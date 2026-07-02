export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import dynamicImport from "next/dynamic";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { prisma } from "@/lib/prisma";
import type { DestinationPin } from "./components/WorldMap";
import Sidebar from "./components/Sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CATEGORY_KEYS, CATEGORY_META, getIncludedCategories } from "@/types/destination";
import type { CategoryData } from "@/types/destination";
import { getSignedImageUrl } from "@/lib/s3-signed-url";

const WorldMap = dynamicImport(() => import("./components/WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[380px] rounded-2xl bg-blue-50 border border-gray-100 animate-pulse" />
  ),
});

export default async function HomePage() {
  const [rawDestinations, session, memberCount] = await Promise.all([
    prisma.destination.findMany({
      where: { published: true },
      orderBy: { createdAt: "asc" },
    }),
    getServerSession(authOptions),
    prisma.user.count(),
  ]);

  const destinations = await Promise.all(
    rawDestinations.map(async (d) => ({
      ...d,
      heroImage: await getSignedImageUrl(d.heroImage),
    }))
  );

  const countryCount = new Set(rawDestinations.map((d) => d.country)).size;
  const coursesPlayed = rawDestinations.filter(
    (d) => ((d.golf as unknown as { score: number })?.score ?? 0) > 0
  ).length;

  const STATS = [
    { label: "Destinations", value: `${rawDestinations.length}` },
    { label: "Courses Played", value: `${coursesPlayed}` },
    { label: "Countries", value: `${countryCount}` },
    { label: "Members", value: `${memberCount.toLocaleString()}` },
  ];

  const isLoggedIn = !!session;

  const pins: DestinationPin[] = rawDestinations
    .filter((d) => d.latitude !== 0 || d.longitude !== 0)
    .map((d) => ({
      slug: d.slug,
      name: d.name,
      country: d.country,
      continent: d.continent,
      overallScore: d.overallScore,
      coordinates: [d.longitude, d.latitude] as [number, number],
    }));

  return (
    <>
      <Nav />

      {/* Hero */}
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
            Real reviews. Honest scores across golf, food, hotels, weather, and more.
            For golfers who want to know exactly where to go next.
          </p>
          
            href="#destinations"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-md bg-gold text-white font-semibold text-base hover:bg-gold-dark transition-colors"
          >
            Explore Destinations
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* Stats */}
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

      {/* What We Score */}
      <section className="bg-gray-50 py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-5 text-center">
            9 Categories — Thomas&apos;s Scores on Everything
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORY_KEYS.map((key) => (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-sm text-gray-700 font-medium"
              >
                <span>{CATEGORY_META[key].icon}</span>
                {CATEGORY_META[key].label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Map + Cards + Sidebar */}
      <section id="destinations" className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 items-start">
            <div className="flex-1 min-w-0">

              {/* World Map */}
              <div className="mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
                  Where I&apos;ve Been
                </h2>
                <p className="text-gray-500 text-base mb-6">
                  Click a pin to see Thomas&apos;s Overall Score and jump to the full review.
                </p>
                <WorldMap destinations={pins} />
              </div>

              {/* Destination Cards */}
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
                  Featured Destinations
                </h2>
                <p className="text-gray-500 text-base mb-8">
                  Handpicked bucket-list golf trips, scored across 9 categories.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {destinations.map((dest) => {
                    const included = getIncludedCategories(dest.includedCategories);
                    const golfData = dest.golf as unknown as CategoryData;
                    const foodData = dest.restaurants as unknown as CategoryData;
                    const hotelData = dest.hotels as unknown as CategoryData;
                    return (
                      <Link key={dest.id} href={`/destinations/${dest.slug}`} className="group block">
                        <article className="h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                          <div className="relative h-48 w-full overflow-hidden">
                            <Image
                              src={dest.heroImage}
                              alt={dest.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            />
                            <div className="absolute top-3 right-3 flex flex-col items-center justify-center w-14 h-14 rounded-full bg-gold shadow-md">
                              <span className="text-white font-bold text-base leading-none">
                                {dest.overallScore.toFixed(1)}
                              </span>
                              <span className="text-white/80 text-[10px] leading-none">/10</span>
                            </div>
                            {!isLoggedIn && (
                              <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/60 text-white text-[11px] font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Free Members
                              </div>
                            )}
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
                            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                              {dest.description}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              {included.includes("golf") && golfData?.score > 0 && (
                                <ScorePill label="⛳ Golf" score={golfData.score} />
                              )}
                              {included.includes("restaurants") && foodData?.score > 0 && (
                                <ScorePill label="🍽️ Food" score={foodData.score} />
                              )}
                              {included.includes("hotels") && hotelData?.score > 0 && (
                                <ScorePill label="🏨 Hotel" score={hotelData.score} />
                              )}
                            </div>
                          </div>
                        </article>
                      </Link>
                    );
                  })}
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
      {label} <span className="font-bold">{score}</span>
    </span>
  );
}