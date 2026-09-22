import { listPosts } from "@/lib/db";
import PostsClient from "./PostsClient";

export const dynamic = "force-dynamic";

export default function PostsPage() {
  return <PostsClient posts={listPosts()} />;
}
