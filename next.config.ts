import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The landing is fully static: export plain HTML/CSS/JS to `out/` for Cloudflare.
  output: "export",
  // Image optimization needs a server; the only images are small logos.
  images: { unoptimized: true },
  // cacheComponents / partialPrefetching enable PPR, which requires a server.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
