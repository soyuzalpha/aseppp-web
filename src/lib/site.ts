/* Single source for the canonical origin. Metadata, sitemap and robots all
   read it, so moving to another hostname is one edit here, not a hunt. */
export const SITE_URL = (
  process.env.SITE_URL ?? "https://profile.soyuz.my.id"
).replace(/\/$/, "");
