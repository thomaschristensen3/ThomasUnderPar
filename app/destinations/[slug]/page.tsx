import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import MarkdownBody from "@/app/components/MarkdownBody";
import Sidebar from "@/app/components/Sidebar";
import { prisma } from "@/lib/prisma";

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
  const dest = await prisma.destination.findUnique({
    where: { slug: params.slug },
  });

  if (!dest) notFound();

  return (
    <>
      <Nav />

      {/* ── Hero image ──────────────────────────────────────────── */}
      <div className="relative h-[55vh] min-h-[320px] w-full">
        <Image
          src={dest.heroImage}
          alt={dest.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-8 sm:pb-10">
          <div className="max-w-7xl mx-auto">
            <span className="inline-block bg-gold text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              {dest.country}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight">
              {dest.name}
            </h1>
          </div>
        </div>
      </div>

      {/* ── Content + Sidebar ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex gap-10 items-start">

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* Score badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <ScoreBadge label="Golf" score={dest.golfScore} />
              <ScoreBadge label="Food" score={dest.foodScore} />
              <ScoreBadge label="Hotel" score={dest.hotelScore} />
              <ScoreBadge label="Overall" score={dest.overallScore} highlight />
            </div>

            {/* Description intro */}
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-10 font-medium">
              {dest.description}
            </p>

            {/* Rich text body */}
            <MarkdownBody body={dest.body} />

            {/* Back link */}
            <div className="mt-14 pt-8 border-t border-gray-100">
              <Link
                href="/#destinations"
                className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-forest-dark transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16l-4-4m0 0l4-4m-4 4h18"
                  />
                </svg>
                Back to Destinations
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </div>

      <Footer />
    </>
  );
}

function ScoreBadge({
  label,
  score,
  highlight = false,
}: {
  label: string;
  score: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-5 rounded-xl ${
        highlight ? "bg-forest text-white" : "bg-white border border-gray-100"
      }`}
    >
      <div
        className={`text-4xl font-bold leading-none ${
          highlight ? "text-white" : "text-forest"
        }`}
      >
        {score}
        <span
          className={`text-base font-normal ${
            highlight ? "text-white/60" : "text-gray-400"
          }`}
        >
          /10
        </span>
      </div>
      <div
        className={`text-xs font-semibold uppercase tracking-widest mt-2 ${
          highlight ? "text-white/75" : "text-gray-400"
        }`}
      >
        {label}
      </div>
    </div>
  );
}
