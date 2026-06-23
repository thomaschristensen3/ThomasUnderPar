import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const categorySchema = z.object({
  score: z.number().int().min(0).max(10),
  description: z.string(),
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

const schema = z.object({
  name: z.string().min(1),
  country: z.string().min(1),
  continent: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  heroImage: z.string().url(),
  overallScore: z.number().min(0).max(10),
  description: z.string().min(1).max(1000),
  published: z.boolean(),
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

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
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
    const destination = await prisma.destination.update({
      where: { slug: params.slug },
      data: parsed.data,
    });
    return NextResponse.json({ slug: destination.slug });
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await prisma.destination.delete({ where: { slug: params.slug } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
