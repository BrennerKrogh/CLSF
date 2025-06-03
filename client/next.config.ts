import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() { 
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true, //Something to do with 308 and 307 redirects, need to revisit
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint during builds EEK!
  },
};

export default nextConfig;
