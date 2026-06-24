/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["react-simple-maps"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      // Railway S3-compatible storage endpoint (t3.storageapi.dev)
      // Matches: thomasunderpar-media-dkfhmt.t3.storageapi.dev
      {
        protocol: "https",
        hostname: "**.t3.storageapi.dev",
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
    ],
  },
};

export default nextConfig;
