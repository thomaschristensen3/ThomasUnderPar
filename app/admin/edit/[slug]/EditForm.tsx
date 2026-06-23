"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CATEGORY_KEYS,
  CATEGORY_META,
  type CategoryData,
  type CategoryKey,
  type MediaItem,
  type SocialLink,
} from "@/types/destination";

const ALL_CATEGORY_KEYS = CATEGORY_KEYS;

const CONTINENTS = ["Africa", "Asia", "Europe", "North America", "Oceania", "South America"];
const SOCIAL_PLATFORMS = ["instagram", "twitter", "youtube", "facebook", "tiktok", "other"];

type BasicFields = {
  name: string;
  country: string;
  continent: string;
  latitude: string;
  longitude: string;
  heroImage: string;
  overallScore: string;
  description: string;
  published: boolean;
};

interface Props {
  slug: string;
  initial: BasicFields;
  initialCategories: Record<CategoryKey, CategoryData>;
  initialIncludedCategories: CategoryKey[];
}

export default function EditForm({ slug, initial, initialCategories, initialIncludedCategories }: Props) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("golf");
  const [basic, setBasic] = useState<BasicFields>(initial);
  const [categories, setCategories] = useState<Record<CategoryKey, CategoryData>>(initialCategories);
  const [includedCategories, setIncludedCategories] = useState<CategoryKey[]>(initialIncludedCategories);

  function toggleCategory(key: CategoryKey) {
    setIncludedCategories((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      // Keep at least one category included
      if (next.length === 0) return prev;
      // If the active tab is being removed, switch to the first remaining tab
      if (key === activeCategory && !next.includes(key)) {
        setActiveCategory(next[0]);
      }
      return next;
    });
  }

  function setBasicField<K extends keyof BasicFields>(k: K, v: BasicFields[K]) {
    setBasic((b) => ({ ...b, [k]: v }));
  }

  function setCategoryField(key: CategoryKey, field: keyof CategoryData, value: unknown) {
    setCategories((c) => ({ ...c, [key]: { ...c[key], [field]: value } }));
  }

  function addMedia(key: CategoryKey) {
    setCategories((c) => ({
      ...c,
      [key]: { ...c[key], media: [...c[key].media, { type: "image", url: "", caption: "" }] },
    }));
  }
  function updateMedia(key: CategoryKey, idx: number, patch: Partial<MediaItem>) {
    setCategories((c) => {
      const media = [...c[key].media];
      media[idx] = { ...media[idx], ...patch };
      return { ...c, [key]: { ...c[key], media } };
    });
  }
  function removeMedia(key: CategoryKey, idx: number) {
    setCategories((c) => ({
      ...c,
      [key]: { ...c[key], media: c[key].media.filter((_, i) => i !== idx) },
    }));
  }

  function addSocial(key: CategoryKey) {
    setCategories((c) => ({
      ...c,
      [key]: { ...c[key], socialLinks: [...c[key].socialLinks, { platform: "instagram", url: "" }] },
    }));
  }
  function updateSocial(key: CategoryKey, idx: number, patch: Partial<SocialLink>) {
    setCategories((c) => {
      const socialLinks = [...c[key].socialLinks];
      socialLinks[idx] = { ...socialLinks[idx], ...patch };
      return { ...c, [key]: { ...c[key], socialLinks } };
    });
  }
  function removeSocial(key: CategoryKey, idx: number) {
    setCategories((c) => ({
      ...c,
      [key]: { ...c[key], socialLinks: c[key].socialLinks.filter((_, i) => i !== idx) },
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    setSubmitting(true);

    const payload = {
      name: basic.name,
      country: basic.country,
      continent: basic.continent,
      latitude: parseFloat(basic.latitude),
      longitude: parseFloat(basic.longitude),
      heroImage: basic.heroImage,
      overallScore: parseFloat(basic.overallScore),
      description: basic.description,
      published: basic.published,
      includedCategories,
      ...categories,
    };

    const res = await fetch(`/api/destinations/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSubmitting(false);

    if (res.ok) {
      const { slug: newSlug } = await res.json();
      router.push(`/destinations/${newSlug}`);
      return;
    }

    const json = await res.json();
    setServerError(json.error ?? "Something went wrong.");
  }

  async function handleDelete() {
    if (!confirm(`Delete "${basic.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    await fetch(`/api/destinations/${slug}`, { method: "DELETE" });
    router.push("/admin");
  }

  const cat = categories[activeCategory];
  const catMeta = CATEGORY_META[activeCategory];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-forest text-white px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
        <span className="font-bold text-lg">ThomasUnderPar — Edit: {basic.name}</span>
        <a href="/admin" className="text-sm text-white/70 hover:text-white transition-colors">
          ← Admin
        </a>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {serverError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <fieldset className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <legend className="text-base font-semibold text-gray-900">Destination Info</legend>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Name">
                <input value={basic.name} onChange={(e) => setBasicField("name", e.target.value)} className={inp()} required />
              </Field>
              <Field label="Country">
                <input value={basic.country} onChange={(e) => setBasicField("country", e.target.value)} className={inp()} required />
              </Field>
              <Field label="Continent">
                <select value={basic.continent} onChange={(e) => setBasicField("continent", e.target.value)} className={inp()}>
                  {CONTINENTS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Slug" hint="Read-only">
                <input value={slug} disabled className={inp("opacity-50 cursor-not-allowed")} />
              </Field>
              <Field label="Latitude">
                <input type="number" step="any" value={basic.latitude} onChange={(e) => setBasicField("latitude", e.target.value)} className={inp()} required />
              </Field>
              <Field label="Longitude">
                <input type="number" step="any" value={basic.longitude} onChange={(e) => setBasicField("longitude", e.target.value)} className={inp()} required />
              </Field>
            </div>
            <Field label="Hero Image URL">
              <input type="url" value={basic.heroImage} onChange={(e) => setBasicField("heroImage", e.target.value)} className={inp()} required />
            </Field>
            <Field label="Description">
              <textarea value={basic.description} onChange={(e) => setBasicField("description", e.target.value)} rows={3} className={inp("resize-none")} required />
            </Field>
          </fieldset>

          {/* Overall Score */}
          <fieldset className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <legend className="text-base font-semibold text-gray-900">Thomas&apos;s Overall Score</legend>
            <div className="flex items-center gap-4">
              <input type="range" min={0} max={10} step={0.1} value={basic.overallScore || 5} onChange={(e) => setBasicField("overallScore", e.target.value)} className="flex-1 accent-forest" />
              <input type="number" step="0.1" min={0} max={10} value={basic.overallScore} onChange={(e) => setBasicField("overallScore", e.target.value)} className={inp("w-20 text-center font-bold text-forest")} required />
              <span className="text-gray-400 text-sm">/10</span>
            </div>
          </fieldset>

          {/* Categories */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-100 px-6 py-4">
              <h2 className="text-base font-semibold text-gray-900">Category Reviews</h2>
            </div>

            {/* Category toggles */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                Active Categories
              </p>
              <div className="flex flex-wrap gap-2">
                {ALL_CATEGORY_KEYS.map((key) => {
                  const isIncluded = includedCategories.includes(key);
                  return (
                    <label
                      key={key}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium cursor-pointer select-none transition-colors ${
                        isIncluded
                          ? "bg-forest text-white border-forest"
                          : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isIncluded}
                        onChange={() => toggleCategory(key)}
                      />
                      <span>{CATEGORY_META[key].icon}</span>
                      <span>{CATEGORY_META[key].label}</span>
                    </label>
                  );
                })}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Uncheck categories that don&apos;t apply to this destination. At least one must remain active.
              </p>
            </div>

            <div className="flex gap-1 p-3 border-b border-gray-100 overflow-x-auto">
              {ALL_CATEGORY_KEYS.filter((key) => includedCategories.includes(key)).map((key) => {
                const score = categories[key].score;
                const hasContent = categories[key].description || categories[key].media.length > 0;
                return (
                  <button key={key} type="button" onClick={() => setActiveCategory(key)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                      activeCategory === key ? "bg-forest text-white" : hasContent ? "bg-emerald-50 text-forest" : "text-gray-500 hover:bg-gray-100"
                    }`}>
                    <span>{CATEGORY_META[key].icon}</span>
                    <span className="hidden sm:inline">{CATEGORY_META[key].label}</span>
                    {score > 0 && (
                      <span className={`text-[10px] font-bold rounded-full px-1 py-0.5 ${activeCategory === key ? "bg-white/20 text-white" : "bg-forest/10 text-forest"}`}>{typeof score === "number" ? score.toFixed(1) : score}</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{catMeta.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{catMeta.label}</h3>
                  <p className="text-sm text-gray-500">{catMeta.description}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Thomas&apos;s Score</label>
                <div className="flex items-center gap-4">
                  <input type="range" min={0} max={10} step={0.1} value={cat.score}
                    onChange={(e) => setCategoryField(activeCategory, "score", parseFloat(e.target.value))}
                    className="flex-1 accent-forest" />
                  <span className="text-3xl font-bold text-forest w-10 text-center">{typeof cat.score === "number" ? cat.score.toFixed(1) : cat.score}</span>
                  <span className="text-gray-400">/10</span>
                </div>
              </div>

              <Field label="Description">
                <textarea value={cat.description}
                  onChange={(e) => setCategoryField(activeCategory, "description", e.target.value)}
                  rows={5} className={inp("resize-none")}
                  placeholder={`Write about the ${catMeta.label.toLowerCase()} experience…`} />
              </Field>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">Photos &amp; Videos</label>
                  <button type="button" onClick={() => addMedia(activeCategory)} className="text-sm font-medium text-forest hover:text-forest-dark flex items-center gap-1">
                    <span className="text-lg leading-none">+</span> Add Media
                  </button>
                </div>
                {cat.media.length === 0 && <p className="text-sm text-gray-400 italic">No media yet.</p>}
                <div className="space-y-3">
                  {cat.media.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-start p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <select value={item.type} onChange={(e) => updateMedia(activeCategory, idx, { type: e.target.value as "image" | "video" })} className={inp()}>
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                        <input type="url" value={item.url} onChange={(e) => updateMedia(activeCategory, idx, { url: e.target.value })} placeholder="URL" className={inp()} />
                        <input value={item.caption || ""} onChange={(e) => updateMedia(activeCategory, idx, { caption: e.target.value })} placeholder="Caption" className={inp()} />
                      </div>
                      <button type="button" onClick={() => removeMedia(activeCategory, idx)} className="text-gray-400 hover:text-red-500 text-xl leading-none mt-1">×</button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">Social Media Links</label>
                  <button type="button" onClick={() => addSocial(activeCategory)} className="text-sm font-medium text-forest hover:text-forest-dark flex items-center gap-1">
                    <span className="text-lg leading-none">+</span> Add Link
                  </button>
                </div>
                {cat.socialLinks.length === 0 && <p className="text-sm text-gray-400 italic">No social links yet.</p>}
                <div className="space-y-3">
                  {cat.socialLinks.map((link, idx) => (
                    <div key={idx} className="flex gap-2 items-start p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <select value={link.platform} onChange={(e) => updateSocial(activeCategory, idx, { platform: e.target.value })} className={inp()}>
                          {SOCIAL_PLATFORMS.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                        </select>
                        <input type="url" value={link.url} onChange={(e) => updateSocial(activeCategory, idx, { url: e.target.value })} placeholder="https://..." className={inp()} />
                      </div>
                      <button type="button" onClick={() => removeSocial(activeCategory, idx)} className="text-gray-400 hover:text-red-500 text-xl leading-none mt-1">×</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input type="checkbox" checked={basic.published} onChange={(e) => setBasicField("published", e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-forest focus:ring-forest" />
                <span className="text-sm font-medium text-gray-700">Published</span>
              </label>
              <button type="button" onClick={handleDelete} disabled={deleting}
                className="text-sm text-red-500 hover:text-red-700 font-medium disabled:opacity-50">
                {deleting ? "Deleting…" : "Delete Destination"}
              </button>
            </div>
            <button type="submit" disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-3 bg-forest text-white font-semibold rounded-lg hover:bg-forest-dark transition-colors disabled:opacity-60">
              {submitting ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

function inp(...extra: string[]) {
  return ["w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900",
    "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest transition-colors bg-white",
    ...extra].join(" ");
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {hint && <span className="ml-2 text-xs text-gray-400 font-normal">{hint}</span>}
      </label>
      {children}
    </div>
  );
}
