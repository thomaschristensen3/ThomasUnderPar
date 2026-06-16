/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["react-simple-maps"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
