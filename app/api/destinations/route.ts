import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const categorySchema = z.object({
  score: z.number().min(0).max(10),
  description: z.string().default(""),
  media: z.array(
    z.object({
      type: z.enum(["image", "video"]),
      url: z.string().url(),
      caption: z.string().optional(),
    })
  ),
  socialLinks: z.array(
    z.object({
      platform: z.string(),
      url: z.string().url(),
    })
  ),
});

const ALL_CATEGORY_KEYS = [
  "golf", "restaurants", "hotels", "transportation", "weather",
  "city", "friendliness", "sights", "extras",
] as const;

const schema = z.object({
  name: z.string().min(1),
  country: z.string().min(1),
  continent: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  heroImage: z.string().url(),
  overallScore: z.number().min(0).max(10),
  description: z.string().min(1).max(1000),
  published: z.boolean(),
  includedCategories: z.array(z.string()).default([...ALL_CATEGORY_KEYS]),
  golf: categorySchema,
  restaurants: categorySchema,
  hotels: categorySchema,
  transportation: categorySchema,
  weather: categorySchema,
  city: categorySchema,
  friendliness: categorySchema,
  sights: categorySchema,
  extras: categorySchema,
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
  }

  try {
    const destination = await prisma.destination.create({ data: parsed.data });
    return NextResponse.json({ slug: destination.slug }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json({ error: "A destination with this slug already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
