import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lighthouse's "valid-source-maps" best-practices audit flags large
  // first-party JS shipped without maps — worth the extra .map files
  // since this is a marketing site, not something guarding proprietary
  // server logic.
  productionBrowserSourceMaps: true,

  // Files in /public are served with `Cache-Control: public, max-age=0` by
  // default, unlike /_next/static — so the models and hero frame sequence were
  // re-downloaded in full on every visit. They're content-fixed assets rebuilt
  // by scripts/ rather than edited in place, so cache them hard and rely on
  // changing the filename (or a deploy) to invalidate.
  async headers() {
    return [
      {
        source: "/:dir(models|frames)/:file*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
