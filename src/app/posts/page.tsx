"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import SectionLabel from "@/components/ui/SectionLabel";

type Post = {
  n: string;
  slug: string;
  title: string;
  date: string;
  tags: string[];
  readTime: number;
  excerpt: string;
  featured?: boolean;
};

const POSTS: Post[] = [
  {
    n: "01",
    slug: "theme-system-nextjs",
    title: "Building a theme system with CSS variables in Next.js",
    date: "Aug 2024",
    tags: ["Next.js", "CSS", "React"],
    readTime: 8,
    excerpt: "How to build a flexible multi-theme system using CSS custom properties and React context — no libraries required.",
    featured: true,
  },
  {
    n: "02",
    slug: "gsap-scroll-animations",
    title: "GSAP scroll animations that actually feel good",
    date: "Jul 2024",
    tags: ["GSAP", "Animation"],
    readTime: 6,
    excerpt: "Practical patterns for smooth, purposeful scroll-triggered animations in React without over-engineering.",
  },
  {
    n: "03",
    slug: "nodejs-api-best-practices",
    title: "Node.js API architecture for 2024",
    date: "Jun 2024",
    tags: ["Node.js", "Backend"],
    readTime: 10,
    excerpt: "Rate limiting, structured error handling, input validation, and logging patterns I use in every production API.",
  },
  {
    n: "04",
    slug: "switched-to-tailwind",
    title: "Why I stopped using CSS Modules",
    date: "May 2024",
    tags: ["CSS", "DX"],
    readTime: 5,
    excerpt: "My honest take after 2 years of Tailwind on real projects — what I love, what I don't, and when I'd choose something else.",
  },
  {
    n: "05",
    slug: "typescript-patterns-react",
    title: "TypeScript patterns every React developer should know",
    date: "Mar 2024",
    tags: ["TypeScript", "React"],
    readTime: 7,
    excerpt: "Discriminated unions, template literal types, and other TS patterns that make your React code genuinely safer.",
  },
  {
    n: "06",
    slug: "nextjs-app-router",
    title: "Understanding the Next.js App Router",
    date: "Feb 2024",
    tags: ["Next.js"],
    readTime: 9,
    excerpt: "Server components, parallel routes, loading states, and data fetching — a practical breakdown of what actually matters.",
  },
];

export default function PostsPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");

  const filtered = POSTS.filter(
    (p) =>
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  useEffect(() => {
    gsap.from(listRef.current?.querySelectorAll(".post-row") ?? [], {
      opacity: 0, y: 14, stagger: 0.06, duration: 0.5, ease: "expo.out",
    });
  }, [search]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".page-title", { opacity: 0, y: 30, duration: 0.8, ease: "expo.out" });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef}>
      <main style={{ paddingTop: "5rem" }}>
        {/* ── Title ── */}
        <div
          className="col"
          style={{ paddingTop: "3rem", paddingBottom: "2rem", borderBottom: "1px solid var(--color-border)" }}
        >
          <p className="mb-3">
            <SectionLabel n="03">Writing</SectionLabel>
          </p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <h1 className="type-title page-title" style={{ color: "var(--color-foreground)" }}>
              Posts
            </h1>
            <span className="type-index">{POSTS.length} articles</span>
          </div>
        </div>

        {/* ── Search ── */}
        <div
          className="col"
          style={{ paddingBlock: "1.25rem", borderBottom: "1px solid var(--color-border)" }}
        >
          <input
            type="text"
            placeholder="Search posts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search posts"
            style={{
              background: "none",
              border: "none",
              outline: "none",
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "var(--color-foreground)",
              width: "100%",
              padding: 0,
            }}
          />
        </div>

        {/* ── Featured post — clickable ── */}
        {search === "" && (() => {
          const f = POSTS.find((p) => p.featured);
          if (!f) return null;
          return (
            <Link
              href={`/posts/${f.slug}`}
              className="col"
              style={{
                display: "grid",
                paddingBlock: "2.5rem",
                borderBottom: "1px solid var(--color-border)",
                gridTemplateColumns: "1fr auto",
                gap: "2rem",
                alignItems: "start",
                textDecoration: "none",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  "color-mix(in srgb, var(--color-foreground) 3%, transparent)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent")
              }
            >
              <div>
                <span className="type-label" style={{ color: "var(--color-accent)", display: "block", marginBottom: "0.75rem" }}>
                  Featured
                </span>
                <h2
                  style={{
                    fontFamily: "var(--font-editorial)",
                    fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
                    letterSpacing: "-0.03em",
                    color: "var(--color-foreground)",
                    lineHeight: 1.05,
                    marginBottom: "0.875rem",
                    maxWidth: "22ch",
                  }}
                >
                  {f.title}
                </h2>
                <p
                  className="type-body"
                  style={{ color: "var(--color-mutedForeground)", maxWidth: "52ch", fontSize: "0.9rem", marginBottom: "1rem" }}
                >
                  {f.excerpt}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {f.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem", paddingTop: "0.25rem", minWidth: "5rem" }}>
                <span className="type-index">{f.date}</span>
                <span className="type-index">{f.readTime} min</span>
                <ArrowUpRight size={16} strokeWidth={1.5} style={{ color: "var(--color-accent)", marginTop: "0.5rem" }} />
              </div>
            </Link>
          );
        })()}

        {/* ── Post list — each row is a Link ── */}
        <div ref={listRef} className="col">
          {filtered.filter((p) => !(search === "" && p.featured)).map((p) => (
            <Link
              key={p.slug}
              href={`/posts/${p.slug}`}
              className="post-row list-row"
              style={{
                borderBottom: "1px solid var(--color-border)",
                paddingBlock: "1.5rem",
                textDecoration: "none",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  "color-mix(in srgb, var(--color-foreground) 3%, transparent)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent")
              }
            >
              <span className="type-index" style={{ paddingTop: "0.2rem" }}>{p.n}</span>

              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-medium)",
                    fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
                    color: "var(--color-foreground)",
                    letterSpacing: "-0.01em",
                    marginBottom: "0.35rem",
                    lineHeight: 1.3,
                  }}
                >
                  {p.title}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>

              <div className="list-row-meta">
                <span className="type-index">{p.date}</span>
                <span className="type-index">{p.readTime} min</span>
                <ArrowUpRight size={13} strokeWidth={1.5} style={{ color: "var(--color-mutedForeground)", marginTop: "0.25rem" }} />
              </div>
            </Link>
          ))}

          {filtered.length === 0 && (
            <p className="type-body py-12" style={{ color: "var(--color-mutedForeground)" }}>
              Nothing found.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
