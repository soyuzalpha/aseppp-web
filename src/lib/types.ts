/* Shared content shapes. Deliberately dependency-free: client components
   import these, and they must never pull node:sqlite into a browser bundle. */

export type Block = {
  type: "p" | "h2" | "h3" | "code" | "blockquote" | "ul";
  content: string | string[];
};

export type Photo = {
  id: number;
  src: string;
  alt: string;
  cat: string;
  w: number;
  h: number;
};

export type Post = {
  id: number;
  slug: string;
  title: string;
  date: string;
  readTime: number;
  tags: string[];
  excerpt: string;
  body: Block[];
  featured: boolean;
};

/** A post plus its 1-based position in the list it was fetched for (the
    filtered set, not the whole archive). Numbering the filtered set is what
    makes the row labels run 01..N contiguously and agree with the pager's
    "09–16 of 19" range. */
export type NumberedPost = Post & { n: number };

export type Project = {
  id: number;
  slug: string;
  n: string;
  title: string;
  year: string;
  role: string;
  status: string;
  tags: string[];
  github: string;
  live: string | null;
  desc: string;
  summary: string;
  challenge: string;
  solution: string;
  outcome: string;
  stack: { layer: string; tools: string[] }[];
  related: string[];
};
