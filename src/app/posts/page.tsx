import { countPosts, getFeaturedPost, listPostsPage } from "@/lib/db";
import PostsClient from "./PostsClient";

export const dynamic = "force-dynamic";

type SearchParams = { page?: string | string[]; q?: string | string[] };

/** First value only. `?q=a&q=b` is not a query we support, and taking the array
    would stringify into "a,b" and match nothing. */
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const q = one(sp.q) ?? "";
  // `listPostsPage` clamps the page itself, so a non-numeric or out-of-range
  // value here is safe to pass straight through.
  const page = Number(one(sp.page) ?? "1") || 1;

  const result = listPostsPage({ page, q, excludeFeatured: true });

  return (
    <PostsClient
      {...result}
      q={q}
      archiveTotal={countPosts()}
      // The featured post is pinned above the list, so it only makes sense in
      // the unfiltered first page — during a search it would sit outside the
      // results, and on page 2+ it would reappear above rows that already
      // come after it.
      featured={q.trim() === "" && result.page === 1 ? getFeaturedPost() : null}
    />
  );
}
