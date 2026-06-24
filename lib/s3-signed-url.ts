import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Parses a plain S3 URL and returns the bucket name and object key.
 *
 * Handles two common URL formats:
 *   - Path-style (custom endpoint):  https://<endpoint>/<bucket>/<key>
 *   - Virtual-hosted-style (AWS):    https://<bucket>.s3.<region>.amazonaws.com/<key>
 */
function parseS3Url(
  url: string
): { bucket: string; key: string } | null {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname;

    // Virtual-hosted-style: <bucket>.s3.<region>.amazonaws.com
    const awsMatch = hostname.match(/^(.+?)\.s3\.[^.]+\.amazonaws\.com$/);
    if (awsMatch) {
      const bucket = awsMatch[1];
      // pathname starts with '/', strip it
      const key = parsed.pathname.replace(/^\//, "");
      return { bucket, key };
    }

    // Path-style (custom endpoint / R2 / MinIO):
    // The first path segment is the bucket, the rest is the key.
    const parts = parsed.pathname.replace(/^\//, "").split("/");
    if (parts.length >= 2) {
      const bucket = parts[0];
      const key = parts.slice(1).join("/");
      return { bucket, key };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Takes a plain S3 object URL (as stored in the database) and returns a
 * pre-signed URL that is valid for 24 hours.  Falls back to the original
 * URL if the environment is not configured or the URL cannot be parsed.
 */
export async function getSignedImageUrl(url: string): Promise<string> {
  const bucket = process.env.BUCKET;
  const region = process.env.REGION;
  const endpoint = process.env.ENDPOINT;
  const accessKeyId = process.env.ACCESS_KEY_ID;
  const secretAccessKey = process.env.SECRET_ACCESS_KEY;

  // If S3 credentials are not configured, return the URL as-is.
  if (!bucket || !accessKeyId || !secretAccessKey) {
    return url;
  }

  const parsed = parseS3Url(url);
  if (!parsed) {
    return url;
  }

  try {
    const s3Client = new S3Client({
      region: region ?? "us-east-1",
      credentials: { accessKeyId, secretAccessKey },
      ...(endpoint ? { endpoint, forcePathStyle: true } : {}),
    });

    const command = new GetObjectCommand({
      Bucket: parsed.bucket,
      Key: parsed.key,
    });

    // Sign the URL with a 24-hour expiry (86 400 seconds).
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 86_400,
    });

    return signedUrl;
  } catch (err) {
    console.error("[s3-signed-url] Failed to sign URL:", url, err);
    return url;
  }
}
