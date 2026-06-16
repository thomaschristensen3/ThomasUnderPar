import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(1),
  country: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  heroImage: z.string().url(),
  golfScore: z.number().int().min(1).max(10),
  foodScore: z.number().int().min(1).max(10),
  hotelScore: z.number().int().min(1).max(10),
  overallScore: z.number().min(0).max(10),
  description: z.string().min(1).max(500),
  body: z.string().min(1),
  published: z.boolean(),
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
    const destination = await prisma.destination.create({
      data: { ...parsed.data, galleryImages: "[]" },
    });
    return NextResponse.json({ slug: destination.slug }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json({ error: "A destination with this slug already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
