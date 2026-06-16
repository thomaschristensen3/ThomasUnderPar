"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  country: z.string().min(1, "Country is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  heroImage: z.string().url("Must be a valid URL"),
  golfScore: z.number().int().min(1).max(10),
  foodScore: z.number().int().min(1).max(10),
  hotelScore: z.number().int().min(1).max(10),
  overallScore: z.number().min(0).max(10),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Max 500 characters"),
  body: z.string().min(1, "Body is required"),
  published: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function NewReviewPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      golfScore: 5,
      foodScore: 5,
      hotelScore: 5,
      overallScore: 5,
      published: false,
    },
  });

  const nameValue = watch("name");
  const golfScore = watch("golfScore");
  const foodScore = watch("foodScore");
  const hotelScore = watch("hotelScore");
  const bodyValue = watch("body");

  // Auto-slug from name (only while slug hasn't been manually edited)
  const [slugTouched, setSlugTouched] = useState(false);
  useEffect(() => {
    if (!slugTouched) {
      setValue("slug", slugify(nameValue ?? ""), { shouldValidate: false });
    }
  }, [nameValue, slugTouched, setValue]);

  // Auto-overall as average of the three scores
  const [overallTouched, setOverallTouched] = useState(false);
  useEffect(() => {
    if (!overallTouched && golfScore && foodScore && hotelScore) {
      const avg = +((golfScore + foodScore + hotelScore) / 3).toFixed(1);
      setValue("overallScore", avg, { shouldValidate: false });
    }
  }, [golfScore, foodScore, hotelScore, overallTouched, setValue]);

  async function onSubmit(data: FormValues) {
    setServerError(null);
    const res = await fetch("/api/destinations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.status === 201) {
      const { slug } = await res.json();
      router.push(`/destinations/${slug}`);
      return;
    }
    const json = await res.json();
    setServerError(
      json.error ?? "Something went wrong. Please check your inputs and try again."
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <header className="bg-forest text-white px-4 sm:px-8 py-4 flex items-center justify-between">
        <span className="font-bold text-lg">ThomasUnderPar — New Review</span>
        <a href="/" className="text-sm text-white/70 hover:text-white transition-colors">
          ← Back to site
        </a>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Add a New Destination</h1>

        {serverError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

          {/* ── Basic info ── */}
          <fieldset className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <legend className="text-base font-semibold text-gray-900 mb-2">Destination Info</legend>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Destination Name" error={errors.name?.message}>
                <input
                  {...register("name")}
                  placeholder="e.g. Augusta National"
                  className={input()}
                />
              </Field>

              <Field label="Country" error={errors.country?.message}>
                <input
                  {...register("country")}
                  placeholder="e.g. USA"
                  className={input()}
                />
              </Field>
            </div>

            <Field
              label="Slug"
              hint="Auto-generated from name — edit to override"
              error={errors.slug?.message}
            >
              <input
                {...register("slug")}
                placeholder="e.g. augusta-national"
                className={input()}
                onChange={(e) => {
                  setSlugTouched(true);
                  setValue("slug", e.target.value, { shouldValidate: true });
                }}
              />
            </Field>

            <Field label="Hero Image URL" error={errors.heroImage?.message}>
              <input
                {...register("heroImage")}
                placeholder="https://picsum.photos/seed/example/1200/600"
                className={input()}
              />
            </Field>

            <Field label="Short Description" hint="Max 500 characters" error={errors.description?.message}>
              <textarea
                {...register("description")}
                rows={3}
                placeholder="A brief description of the destination shown on cards."
                className={input("resize-none")}
              />
            </Field>
          </fieldset>

          {/* ── Scores ── */}
          <fieldset className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <legend className="text-base font-semibold text-gray-900 mb-5">Scores (1–10)</legend>

            <div className="grid sm:grid-cols-2 gap-6">
              {(
                [
                  { name: "golfScore", label: "Golf Score" },
                  { name: "foodScore", label: "Food Score" },
                  { name: "hotelScore", label: "Hotel Score" },
                ] as const
              ).map(({ name, label }) => (
                <ScoreField
                  key={name}
                  label={label}
                  value={watch(name)}
                  error={errors[name]?.message}
                  register={register(name, { valueAsNumber: true })}
                  onChange={(v) => {
                    setValue(name, v, { shouldValidate: true });
                  }}
                />
              ))}

              <Field
                label="Overall Score"
                hint="Auto-averaged — edit to override"
                error={errors.overallScore?.message}
              >
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={10}
                  {...register("overallScore", { valueAsNumber: true })}
                  onChange={(e) => {
                    setOverallTouched(true);
                    setValue("overallScore", parseFloat(e.target.value), { shouldValidate: true });
                  }}
                  className={input("w-28")}
                />
              </Field>
            </div>
          </fieldset>

          {/* ── Full review body ── */}
          <fieldset className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <legend className="text-base font-semibold text-gray-900">Full Review (Markdown)</legend>
              <div className="flex rounded-lg overflow-hidden border border-gray-200 text-sm">
                <button
                  type="button"
                  onClick={() => setPreviewMode(false)}
                  className={`px-3 py-1.5 transition-colors ${!previewMode ? "bg-forest text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode(true)}
                  className={`px-3 py-1.5 transition-colors ${previewMode ? "bg-forest text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                >
                  Preview
                </button>
              </div>
            </div>

            {errors.body && (
              <p className="text-xs text-red-600 mb-2">{errors.body.message}</p>
            )}

            <div className="lg:grid lg:grid-cols-2 lg:gap-4">
              <textarea
                {...register("body")}
                rows={20}
                placeholder={"Write your full review in Markdown...\n\n## Overview\n\n## The Golf\n\n## Food & Drink\n\n## Where to Stay\n\n## Verdict"}
                className={`${input("resize-none font-mono text-sm")} ${previewMode ? "hidden lg:block" : ""}`}
              />
              <div
                className={`prose max-w-none text-sm border border-gray-100 rounded-lg p-4 min-h-[200px] overflow-auto ${!previewMode ? "hidden lg:block" : ""}`}
              >
                {bodyValue ? (
                  <ReactMarkdown>{bodyValue}</ReactMarkdown>
                ) : (
                  <p className="text-gray-400 italic">Preview will appear here…</p>
                )}
              </div>
            </div>
          </fieldset>

          {/* ── Publish toggle + submit ── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                {...register("published")}
                className="w-5 h-5 rounded border-gray-300 text-forest focus:ring-forest cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700">
                Publish immediately
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-3 bg-forest text-white font-semibold rounded-lg hover:bg-forest-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving…" : "Save Destination"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

/* ── Helpers ── */

function input(...extra: string[]) {
  return [
    "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900",
    "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest",
    "transition-colors",
    ...extra,
  ].join(" ");
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {hint && <span className="ml-2 text-xs text-gray-400 font-normal">{hint}</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function ScoreField({
  label,
  value,
  error,
  register,
  onChange,
}: {
  label: string;
  value: number;
  error?: string;
  register: object;
  onChange: (v: number) => void;
}) {
  return (
    <Field label={label} error={error}>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={value ?? 5}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="flex-1 accent-forest"
          {...register}
        />
        <span className="w-8 text-center text-sm font-bold text-forest tabular-nums">
          {value ?? 5}
        </span>
      </div>
    </Field>
  );
}
