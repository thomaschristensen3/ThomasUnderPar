"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CATEGORY_KEYS,
  CATEGORY_META,
  emptyCategory,
  type CategoryData,
  type CategoryKey,
  type MediaItem,
  type SocialLink,
} from "@/types/destination";

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

type BasicFields = {
  name: string;
  country: string;
  continent: string;
  latitude: string;
  longitude: string;
  slug: string;
  heroImage: string;
  overallScore: string;
  description: string;
  published: boolean;
};

const CONTINENTS = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America",
];

const SOCIAL_PLATFORMS = [
  "instagram",
  "twitter",
  "youtube",
  "facebook",
  "tiktok",
  "other",
];

export default function NewReviewPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("golf");

  const [basic, setBasic] = useState<BasicFields>({
    name: "",
    country: "",
    continent: "Europe",
    latitude: "",
    longitude: "",
    slug: "",
    heroImage: "",
    overallScore: "",
    description: "",
    published: false,
  });

  const [categories, setCategories] = useState<Record<CategoryKey, CategoryData>>(
    () =>
      Object.fromEntries(
        CATEGORY_KEYS.map((k) => [k, emptyCategory()])
      ) as Record<CategoryKey, CategoryData>
  );

  // Auto-slug
  useEffect(() => {
    if (!slugTouched) {
      setBasic((b) => ({ ...b, slug: slugify(b.name) }));
    }
  }, [basic.name, slugTouched]);

  function setBasicField<K extends keyof BasicFields>(k: K, v: BasicFields[K]) {
    setBasic((b) => ({ ...b, [k]: v }));
  }

  function setCategoryField(key: CategoryKey, field: keyof CategoryData, value: unknown) {
    setCategories((c) => ({
      ...c,
      [key]: { ...c[key], [field]: value },
    }));
  }

  function addMedia(key: CategoryKey) {
    setCategories((c) => ({
      ...c,
      [key]: {
        ...c[key],
        media: [...c[key].media, { type: "image", url: "", caption: "" }],
      },
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
    setCategories((c) => {
      const media = c[key].media.filter((_, i) => i !== idx);
      return { ...c, [key]: { ...c[key], media } };
    });
  }

  function addSocial(key: CategoryKey) {
    setCategories((c) => ({
      ...c,
      [key]: {
        ...c[key],
        socialLinks: [...c[key].socialLinks, { platform: "instagram", url: "" }],
      },
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
    setCategories((c) => {
      const socialLinks = c[key].socialLinks.filter((_, i) => i !== idx);
      return { ...c, [key]: { ...c[key], socialLinks } };
    });
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
      slug: basic.slug,
      heroImage: basic.heroImage,
      overallScore: parseFloat(basic.overallScore),
      description: basic.description,
      published: basic.published,
      ...categories,
    };

    const res = await fetch("/api/destinations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSubmitting(false);

    if (res.status === 201) {
      const { slug } = await res.json();
      router.push(`/destinations/${slug}`);
      return;
    }

    const json = await res.json();
    setServerError(json.error ?? "Something went wrong. Check your inputs and try again.");
  }

  const cat = categories[activeCategory];
  const catMeta = CATEGORY_META[activeCategory];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-forest text-white px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
        <span className="font-bold text-lg">ThomasUnderPar — New Destination</span>
        <a href="/" className="text-sm text-white/70 hover:text-white transition-colors">
          ← Back to site
        </a>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Add a New Destination</h1>
        <p className="text-gray-500 text-sm mb-8">
          Fill in the basics, then add Thomas&apos;s scores, photos, and social links for each category.
        </p>

        {serverError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Basic Info */}
          <Section title="Destination Info">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Destination Name">
                <input
                  value={basic.name}
                  onChange={(e) => setBasicField("name", e.target.value)}
                  placeholder="e.g. Augusta National"
                  className={inp()}
                  required
                />
              </Field>
              <Field label="Country">
                <input
                  value={basic.country}
                  onChange={(e) => setBasicField("country", e.target.value)}
                  placeholder="e.g. USA"
                  className={inp()}
                  required
                />
              </Field>
              <Field label="Continent">
                <select
                  value={basic.continent}
                  onChange={(e) => setBasicField("continent", e.target.value)}
                  className={inp()}
                >
                  {CONTINENTS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Slug" hint="Auto-generated — edit to override">
                <input
                  value={basic.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setBasicField("slug", e.target.value);
                  }}
                  placeholder="e.g. augusta-national"
                  className={inp()}
                  pattern="[a-z0-9-]+"
                  required
                />
              </Field>
              <Field label="Latitude" hint="Decimal, e.g. 36.57">
                <input
                  type="number"
                  step="any"
                  value={basic.latitude}
                  onChange={(e) => setBasicField("latitude", e.target.value)}
                  placeholder="36.57"
                  className={inp()}
                  required
                />
              </Field>
              <Field label="Longitude" hint="Decimal, e.g. -121.95">
                <input
                  type="number"
                  step="any"
                  value={basic.longitude}
                  onChange={(e) => setBasicField("longitude", e.target.value)}
                  placeholder="-121.95"
                  className={inp()}
                  required
                />
              </Field>
            </div>

            <Field label="Hero Image URL">
              <input
                value={basic.heroImage}
                onChange={(e) => setBasicField("heroImage", e.target.value)}
                placeholder="https://example.com/image.jpg"
                type="url"
                className={inp()}
                required
              />
            </Field>

            <Field label="Short Description" hint="Shown on cards and as the intro — max 1000 characters">
              <textarea
                value={basic.description}
                onChange={(e) => setBasicField("description", e.target.value)}
                rows={3}
                placeholder="A compelling overview of the destination."
                className={inp("resize-none")}
                maxLength={1000}
                required
              />
            </Field>
          </Section>

          {/* Overall Score */}
          <Section title="Thomas's Overall Score">
            <p className="text-sm text-gray-500 mb-4">
              This is the headline score displayed prominently on the destination page and map.
            </p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={0}
                max={10}
                step={0.1}
                value={basic.overallScore || 5}
                onChange={(e) => setBasicField("overallScore", e.target.value)}
                className="flex-1 accent-forest"
              />
              <div className="w-20 shrink-0">
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={10}
                  value={basic.overallScore}
                  onChange={(e) => setBasicField("overallScore", e.target.value)}
                  className={inp("text-center font-bold text-forest")}
                  required
                />
              </div>
              <span className="text-gray-400 text-sm">/10</span>
            </div>
          </Section>

          {/* Category Sections */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-100 px-6 py-4">
              <h2 className="text-base font-semibold text-gray-900 mb-1">Category Reviews</h2>
              <p className="text-sm text-gray-500">
                For each category, set Thomas&apos;s Score, write a description, and add photos/videos and social links.
              </p>
            </div>

            {/* Category tabs */}
            <div className="flex gap-1 p-3 border-b border-gray-100 overflow-x-auto">
              {CATEGORY_KEYS.map((key) => {
                const score = categories[key].score;
                const hasContent = categories[key].description || categories[key].media.length > 0;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveCategory(key)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                      activeCategory === key
                        ? "bg-forest text-white"
                        : hasContent
                        ? "bg-emerald-50 text-forest"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <span>{CATEGORY_META[key].icon}</span>
                    <span className="hidden sm:inline">{CATEGORY_META[key].label}</span>
                    {score > 0 && (
                      <span className={`text-[10px] font-bold rounded-full px-1 py-0.5 ${
                        activeCategory === key ? "bg-white/20 text-white" : "bg-forest/10 text-forest"
                      }`}>
                        {score}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active category editor */}
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{catMeta.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{catMeta.label}</h3>
                  <p className="text-sm text-gray-500">{catMeta.description}</p>
                </div>
              </div>

              {/* Score */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Thomas&apos;s Score for {catMeta.label}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={1}
                    value={cat.score}
                    onChange={(e) =>
                      setCategoryField(activeCategory, "score", parseInt(e.target.value))
                    }
                    className="flex-1 accent-forest"
                  />
                  <span className="text-3xl font-bold text-forest w-10 text-center tabular-nums">
                    {cat.score}
                  </span>
                  <span className="text-gray-400">/10</span>
                </div>
              </div>

              {/* Description */}
              <Field label={`Description — ${catMeta.label}`}>
                <textarea
                  value={cat.description}
                  onChange={(e) =>
                    setCategoryField(activeCategory, "description", e.target.value)
                  }
                  rows={5}
                  placeholder={`Write about the ${catMeta.label.toLowerCase()} experience at this destination…`}
                  className={inp("resize-none")}
                />
              </Field>

              {/* Media */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">
                    Photos &amp; Videos
                  </label>
                  <button
                    type="button"
                    onClick={() => addMedia(activeCategory)}
                    className="text-sm font-medium text-forest hover:text-forest-dark flex items-center gap-1"
                  >
                    <span className="text-lg leading-none">+</span> Add Media
                  </button>
                </div>
                {cat.media.length === 0 && (
                  <p className="text-sm text-gray-400 italic">
                    No media added yet. Click &quot;Add Media&quot; to include photos or videos.
                  </p>
                )}
                <div className="space-y-3">
                  {cat.media.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-start p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <select
                          value={item.type}
                          onChange={(e) =>
                            updateMedia(activeCategory, idx, {
                              type: e.target.value as "image" | "video",
                            })
                          }
                          className={inp()}
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                        <input
                          type="url"
                          value={item.url}
                          onChange={(e) => updateMedia(activeCategory, idx, { url: e.target.value })}
                          placeholder="https://example.com/photo.jpg"
                          className={inp()}
                        />
                        <input
                          value={item.caption || ""}
                          onChange={(e) => updateMedia(activeCategory, idx, { caption: e.target.value })}
                          placeholder="Caption (optional)"
                          className={inp()}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMedia(activeCategory, idx)}
                        className="text-gray-400 hover:text-red-500 transition-colors text-xl leading-none mt-1 shrink-0"
                        aria-label="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">
                    Social Media Links
                  </label>
                  <button
                    type="button"
                    onClick={() => addSocial(activeCategory)}
                    className="text-sm font-medium text-forest hover:text-forest-dark flex items-center gap-1"
                  >
                    <span className="text-lg leading-none">+</span> Add Link
                  </button>
                </div>
                {cat.socialLinks.length === 0 && (
                  <p className="text-sm text-gray-400 italic">
                    No social links added yet. Link to Instagram posts, YouTube videos, tweets, etc.
                  </p>
                )}
                <div className="space-y-3">
                  {cat.socialLinks.map((link, idx) => (
                    <div key={idx} className="flex gap-2 items-start p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <select
                          value={link.platform}
                          onChange={(e) =>
                            updateSocial(activeCategory, idx, { platform: e.target.value })
                          }
                          className={inp()}
                        >
                          {SOCIAL_PLATFORMS.map((p) => (
                            <option key={p} value={p}>
                              {p.charAt(0).toUpperCase() + p.slice(1)}
                            </option>
                          ))}
                        </select>
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => updateSocial(activeCategory, idx, { url: e.target.value })}
                          placeholder="https://instagram.com/p/..."
                          className={inp()}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSocial(activeCategory, idx)}
                        className="text-gray-400 hover:text-red-500 transition-colors text-xl leading-none mt-1 shrink-0"
                        aria-label="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Publish + Submit */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={basic.published}
                onChange={(e) => setBasicField("published", e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-forest focus:ring-forest cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700">Publish immediately</span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-3 bg-forest text-white font-semibold rounded-lg hover:bg-forest-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Saving…" : "Save Destination"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

/* ── Helpers ── */

function inp(...extra: string[]) {
  return [
    "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900",
    "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest",
    "transition-colors bg-white",
    ...extra,
  ].join(" ");
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
      <legend className="text-base font-semibold text-gray-900">{title}</legend>
      {children}
    </fieldset>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
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
