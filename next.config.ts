import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lighthouse's "valid-source-maps" best-practices audit flags large
  // first-party JS shipped without maps — worth the extra .map files
  // since this is a marketing site, not something guarding proprietary
  // server logic.
  productionBrowserSourceMaps: true,
};

export default nextConfig;
