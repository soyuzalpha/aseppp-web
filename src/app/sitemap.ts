import type { MetadataRoute } from "next";
import { listPosts, listProjects } from "@/lib/db";
import { SITE_URL } from "@/lib/site";

// Content lives in SQLite and changes without a deploy, so the sitemap is
// built per request — same reason every page sets force-dynamic.
export const dynamic = "force-dynamic";

/* ponytail: no `lastModified`. The `date` column is a display string
   ("Feb 2024"), and created_at is the seed timestamp — identical on every
   row, so it would claim all posts changed at once. Omit rather than lie;
   add lastModified once posts carry a real per-post timestamp. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, priority: 1 },
    { url: `${SITE_URL}/posts`, priority: 0.9 },
    ...listPosts().map((p) => ({
      url: `${SITE_URL}/posts/${p.slug}`,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/project`, priority: 0.7 },
    ...listProjects().map((p) => ({
      url: `${SITE_URL}/project/${p.slug}`,
      priority: 0.7,
    })),
    { url: `${SITE_URL}/about`, priority: 0.6 },
    { url: `${SITE_URL}/pics`, priority: 0.5 },
  ];
}
