import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  async headers() {
    const allowedOrigins =
      process.env.IFRAME_ALLOWED_ORIGINS ||
      "https://mivogue.com https://www.mivogue.com";
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors 'self' ${allowedOrigins}`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
