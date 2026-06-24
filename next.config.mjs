/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["react-simple-maps"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      // Explicit pattern for the thomasunderpar-media S3 bucket
      // Matches: thomasunderpar-media.s3.<region>.amazonaws.com
      {
        protocol: "https",
        hostname: "thomasunderpar-media.s3.*.amazonaws.com",
      },
      // AWS S3 — standard bucket URLs (*.s3.*.amazonaws.com)
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      // Custom S3-compatible endpoints (Cloudflare R2, MinIO, etc.)
      // These are matched by the wildcard below; tighten if needed.
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
