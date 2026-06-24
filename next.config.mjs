/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["react-simple-maps"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
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
