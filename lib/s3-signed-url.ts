import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getS3Client(): S3Client {
  const region = process.env.REGION ?? "us-east-1";
  const endpoint = process.env.ENDPOINT;
  const accessKeyId = process.env.ACCESS_KEY_ID ?? "";
  const secretAccessKey = process.env.SECRET_ACCESS_KEY ?? "";

  return new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
    ...(endpoint ? { endpoint, forcePathStyle: true } : {}),
  });
}

/**
 * Given a full S3 object URL (e.g. https://bucket.s3.region.amazonaws.com/key),
 * returns a pre-signed URL valid for 1 hour. Falls back to the original URL if
 * the environment is not configured or the URL cannot be parsed.
 */
export async function getSignedImageUrl(url: string): Promise<string> {
  const bucket = process.env.BUCKET;
  const accessKeyId = process.env.ACCESS_KEY_ID;
  const secretAccessKey = process.env.SECRET_ACCESS_KEY;

  if (!bucket || !accessKeyId || !secretAccessKey || !url) {
    return url;
  }

  try {
    // Extract the S3 key from the URL.
    // Supports both path-style (endpoint/bucket/key) and virtual-hosted-style
    // (bucket.s3.region.amazonaws.com/key) URLs.
    const parsed = new URL(url);
    let key: string;

    const endpoint = process.env.ENDPOINT;
    if (endpoint) {
      // Path-style: <endpoint>/<bucket>/<key>
      const prefix = `/${bucket}/`;
      key = parsed.pathname.startsWith(prefix)
        ? parsed.pathname.slice(prefix.length)
        : parsed.pathname.slice(1);
    } else {
      // Virtual-hosted-style: <bucket>.s3.<region>.amazonaws.com/<key>
      key = parsed.pathname.slice(1);
    }

    const client = getS3Client();
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    return await getSignedUrl(client, command, { expiresIn: 3600 });
  } catch {
    // If anything goes wrong, return the original URL rather than breaking the page.
    return url;
  }
}
