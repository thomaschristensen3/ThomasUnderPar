export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CATEGORY_KEYS, type CategoryData } from "@/types/destination";

export const metadata = { title: "Admin — ThomasUnderPar" };

export default async function AdminPage() {
  const destinations = await prisma.destination.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-forest text-white px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
        <span className="font-bold text-lg">ThomasUnderPar — Admin</span>
        <a href="/" className="text-sm text-white/70 hover:text-white transition-colors">
          ← Back to site
        </a>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Destinations</h1>
            <p className="text-sm text-gray-500 mt-1">{destinations.length} total</p>
          </div>
          <Link
            href="/admin/new-review"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest text-white font-semibold rounded-lg hover:bg-forest-dark transition-colors text-sm"
          >
            + New Destination
          </Link>
        </div>

        {destinations.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No destinations yet. Add your first one!
          </div>
        ) : (
          <div className="space-y-3">
            {destinations.map((dest) => {
              const scores = CATEGORY_KEYS
                .map((k) => (dest[k] as unknown as CategoryData)?.score ?? 0)
                .filter((s) => s > 0);
              const avgScore =
                scores.length > 0
                  ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
                  : "—";

              return (
                <div
                  key={dest.id}
                  className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 shadow-sm p-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-gray-900 truncate">{dest.name}</h2>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          dest.published
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {dest.published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {dest.country} · {dest.continent} · {scores.length} categories scored · avg {avgScore}/10
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-center">
                      <div className="text-xl font-bold text-forest">{dest.overallScore}</div>
                      <div className="text-[10px] text-gray-400">Overall</div>
                    </div>
                    <Link
                      href={`/destinations/${dest.slug}`}
                      className="text-sm text-forest hover:text-forest-dark font-medium px-3 py-1.5 rounded-lg hover:bg-forest/5 transition-colors"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/edit/${dest.slug}`}
                      className="text-sm text-gray-600 hover:text-gray-900 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
