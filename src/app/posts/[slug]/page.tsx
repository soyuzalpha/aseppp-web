import { notFound } from "next/navigation";
import { getPost, listPosts } from "@/lib/db";
import type { Post } from "@/lib/types";
import PostDetailClient from "./PostDetailClient";

export const dynamic = "force-dynamic";

/** Related = other posts sharing at least one tag. Deriving it beats a
    hand-maintained slug map that goes stale the moment a post is added. */
function relatedPosts(post: Post): Post[] {
  return listPosts()
    .filter((p) => p.slug !== post.slug && p.tags.some((t) => post.tags.includes(t)))
    .slice(0, 2);
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return <PostDetailClient post={post} related={relatedPosts(post)} />;
}
