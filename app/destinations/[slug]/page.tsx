export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import Sidebar from "@/app/components/Sidebar";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  CATEGORY_KEYS,
  CATEGORY_META,
  type CategoryData,
  type CategoryKey,
  type MediaItem,
  type SocialLink,
} from "@/types/destination";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const dest = await prisma.destination.findUnique({
    where: { slug: params.slug },
    select: { name: true, description: true },
  });
  if (!dest) return {};
  return {
    title: `${dest.name} — ThomasUnderPar`,
    description: dest.description,
  };
}

export default async function DestinationPage({ params }: Props) {
  const [dest, session] = await Promise.all([
    prisma.destination.findUnique({ where: { slug: params.slug } }),
    getServerSession(authOptions),
  ]);

  if (!dest) notFound();

  const isLoggedIn = !!session;

  const categories = CATEGORY_KEYS.map((key) => ({
    key,
    meta: CATEGORY_META[key],
    data: dest[key] as unknown as CategoryData,
  }));

  const scoredCategories = categories.filter((c) => c.data?.score > 0);

  return (
    <>
      <Nav />

      {/* Hero */}
      <div className="relative h-[60vh] min-h-[340px] w-full">
        <Image
          src={dest.heroImage}
          alt={dest.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block bg-gold text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full">
                {dest.country}
              </span>
              <span className="inline-block bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
                {dest.continent}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight">
              {dest.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Content + Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex gap-10 items-start">
          <div className="flex-1 min-w-0">

            {/* Thomas's Overall Score */}
            <div className="mb-10 p-6 rounded-2xl bg-forest text-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-1">
                    Thomas&apos;s Overall Score
                  </p>
                  <p className="text-white/70 text-sm max-w-sm">{dest.description}</p>
                </div>
                <div className="flex items-baseline gap-1 shrink-0">
                  <span className="text-7xl font-bold text-white leading-none">
                    {dest.overallScore}
                  </span>
                  <span className="text-2xl text-white/50">/10</span>
                </div>
              </div>
            </div>

            {/* Score grid — always visible */}
            {scoredCategories.length > 0 && (
              <div className="mb-12">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Thomas&apos;s Scores at a Glance
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {scoredCategories.map(({ key, meta, data }) => (
                    <a
                      key={key}
                      href={isLoggedIn ? `#${key}` : undefined}
                      className={`flex flex-col items-center justify-center py-4 px-2 rounded-xl border text-center transition-all ${
                        isLoggedIn
                          ? "border-gray-100 bg-white hover:border-forest/30 hover:shadow-sm cursor-pointer"
                          : "border-gray-100 bg-white cursor-default"
                      }`}
                    >
                      <span className="text-2xl mb-1">{meta.icon}</span>
                      <span className="text-2xl font-bold text-forest leading-none">
                        {data.score}
                      </span>
                      <span className="text-[10px] text-gray-400 mt-0.5">/10</span>
                      <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mt-1 leading-tight">
                        {meta.label}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {isLoggedIn ? (
              /* Full category reviews for members */
              <div className="space-y-16">
                {categories.map(({ key, meta, data }) => (
                  <CategorySection key={key} id={key} meta={meta} data={data} />
                ))}
              </div>
            ) : (
              /* Gate for visitors */
              <div className="relative">
                <div className="select-none pointer-events-none blur-sm opacity-50 space-y-8">
                  {categories.slice(0, 2).map(({ key, meta, data }) => (
                    <div key={key} className="border border-gray-100 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{meta.icon}</span>
                        <h2 className="text-xl font-bold text-gray-900">{meta.label}</h2>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-3">{data?.description || meta.description}</p>
                    </div>
                  ))}
                </div>
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />

                <div className="relative mt-4 rounded-2xl border border-gray-100 bg-gray-50 p-8 text-center shadow-sm">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-forest/10 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Free members get the full review
                  </h2>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
                    Create a free account to read Thomas&apos;s full scores and write-ups across all 9 categories — plus photos, videos, and social content.
                  </p>
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <Link
                      href={`/register?callbackUrl=/destinations/${dest.slug}`}
                      className="inline-flex items-center px-6 py-3 rounded-md bg-forest text-white text-sm font-semibold hover:bg-forest-dark transition-colors"
                    >
                      Join Free
                    </Link>
                    <Link
                      href={`/login?callbackUrl=/destinations/${dest.slug}`}
                      className="inline-flex items-center px-6 py-3 rounded-md border border-forest text-forest text-sm font-semibold hover:bg-forest/5 transition-colors"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-14 pt-8 border-t border-gray-100">
              <Link
                href="/#destinations"
                className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-forest-dark transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                Back to Destinations
              </Link>
            </div>
          </div>

          <Sidebar />
        </div>
      </div>

      <Footer />
    </>
  );
}

function CategorySection({
  id,
  meta,
  data,
}: {
  id: CategoryKey;
  meta: (typeof CATEGORY_META)[CategoryKey];
  data: CategoryData;
}) {
  if (!data) return null;

  const scoreColor =
    data.score >= 9
      ? "text-emerald-600"
      : data.score >= 7
      ? "text-forest"
      : data.score >= 5
      ? "text-gold"
      : "text-red-500";

  return (
    <section id={id} className="scroll-mt-20">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{meta.icon}</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{meta.label}</h2>
            <p className="text-sm text-gray-500">{meta.description}</p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
            Thomas&apos;s Score
          </p>
          <div className="flex items-baseline justify-end gap-0.5">
            <span className={`text-4xl font-bold leading-none ${scoreColor}`}>
              {data.score}
            </span>
            <span className="text-base text-gray-400">/10</span>
          </div>
        </div>
      </div>

      {/* Description */}
      {data.description && (
        <p className="text-gray-700 text-base leading-relaxed mb-6">{data.description}</p>
      )}

      {/* Media grid */}
      {data.media && data.media.length > 0 && (
        <MediaGrid items={data.media} />
      )}

      {/* Social links */}
      {data.socialLinks && data.socialLinks.length > 0 && (
        <SocialLinks links={data.socialLinks} />
      )}

      <div className="mt-8 border-b border-gray-100" />
    </section>
  );
}

function MediaGrid({ items }: { items: MediaItem[] }) {
  return (
    <div className={`grid gap-3 mb-6 ${items.length === 1 ? "grid-cols-1" : items.length === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}>
      {items.map((item, i) => (
        <div key={i} className="relative rounded-xl overflow-hidden bg-gray-100 aspect-video group">
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
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 text-white hover:opacity-90 transition-opacity"
              >
                <div className="w-14 h-14 rounded-full bg-forest/90 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-700">{item.caption || "Watch video"}</span>
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  twitter: "Twitter / X",
  youtube: "YouTube",
  facebook: "Facebook",
  tiktok: "TikTok",
  other: "Link",
};

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "bg-gradient-to-r from-purple-500 to-pink-500",
  twitter: "bg-black",
  youtube: "bg-red-600",
  facebook: "bg-blue-600",
  tiktok: "bg-gray-900",
  other: "bg-gray-600",
};

function SocialLinks({ links }: { links: SocialLink[] }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <p className="w-full text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
        See more on social
      </p>
      {links.map((link, i) => (
        <a
          key={i}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium transition-opacity hover:opacity-90 ${
            PLATFORM_COLORS[link.platform] ?? PLATFORM_COLORS.other
          }`}
        >
          <span>{PLATFORM_LABELS[link.platform] ?? link.platform}</span>
          <svg className="w-3.5 h-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      ))}
    </div>
  );
}
