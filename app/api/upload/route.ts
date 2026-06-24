import { NextResponse } from "next/server";

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
};

const ALLOWED_VIDEO_TYPES: Record<string, string> = {
  "video/quicktime": "mov",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

const ALL_ALLOWED_TYPES = { ...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES };

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB

function generateKey(folder: string, originalName: string, ext: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  const safeName = originalName
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40);
  return `${folder}/${timestamp}-${random}-${safeName}.${ext}`;
}

export async function POST(request: Request) {
  // Validate environment
  const bucket = process.env.BUCKET;
  const region = process.env.REGION;
  const endpoint = process.env.ENDPOINT;
  const accessKeyId = process.env.ACCESS_KEY_ID;
  const secretAccessKey = process.env.SECRET_ACCESS_KEY;

  if (!bucket || !accessKeyId || !secretAccessKey) {
    return NextResponse.json(
      { error: "S3 storage is not configured on this server." },
      { status: 503 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid multipart/form-data request." }, { status: 400 });
  }

  const file = formData.get("file");
  const folder = (formData.get("folder") as string | null) ?? "media";

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const mimeType = file.type;
  const ext = ALL_ALLOWED_TYPES[mimeType];

  if (!ext) {
    return NextResponse.json(
      {
        error: `Unsupported file type: ${mimeType}. Allowed types: jpg, jpeg, png, gif, webp, mov, mp4, webm.`,
      },
      { status: 415 }
    );
  }

  const isVideo = mimeType in ALLOWED_VIDEO_TYPES;
  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

  if (file.size > maxSize) {
    const limitMB = maxSize / (1024 * 1024);
    return NextResponse.json(
      { error: `File too large. Maximum size for ${isVideo ? "videos" : "images"} is ${limitMB} MB.` },
      { status: 413 }
    );
  }

  const key = generateKey(folder, file.name, ext);

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Use Bun.s3 native API
    const s3Options: Record<string, string> = {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      bucket: bucket,
    };
    if (region) s3Options.region = region;
    if (endpoint) s3Options.endpoint = endpoint;

    // @ts-expect-error — Bun.s3 is a Bun-native API not in TypeScript lib
    const s3File = Bun.s3(key, s3Options);
    await s3File.write(buffer, { type: mimeType });

    // Build the public URL
    let fileUrl: string;
    if (endpoint) {
      // Custom endpoint (e.g. Cloudflare R2, MinIO)
      const base = endpoint.replace(/\/$/, "");
      fileUrl = `${base}/${bucket}/${key}`;
    } else {
      // Standard AWS S3
      const r = region ?? "us-east-1";
      fileUrl = `https://${bucket}.s3.${r}.amazonaws.com/${key}`;
    }

    return NextResponse.json({ url: fileUrl, key }, { status: 200 });
  } catch (err: unknown) {
    console.error("[upload] S3 write error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Upload failed: ${message}` },
      { status: 500 }
    );
  }
}
