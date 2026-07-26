/**
 * Canonical site URL, used by metadata/sitemap/robots generation. Set
 * NEXT_PUBLIC_SITE_URL once a real domain exists (Sprint 7A — Deployment);
 * this placeholder only exists so those generators have something to
 * resolve absolute URLs against before then.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://forest-website.example.com";

export const SITE_NAME = "Forest";
export const SITE_DESCRIPTION = "A premium cinematic scroll experience through a living forest.";
