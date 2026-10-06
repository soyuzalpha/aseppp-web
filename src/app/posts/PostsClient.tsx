"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Footer from "@/components/layout/Footer";
import SectionLabel from "@/components/ui/SectionLabel";
import type { NumberedPost, Post } from "@/lib/types";

type Props = {
  posts: NumberedPost[];
  /** Rows matching the current search, across all pages. */
  total: number;
  page: number;
  pages: number;
  perPage: number;
  q: string;
  /** Rows in the whole archive, ignoring the search. */
  archiveTotal: number;
  featured: Post | null;
};

/** Page 1 and the empty query stay out of the URL, so the canonical
    `/posts` never accumulates `?page=1` noise. */
const pageHref = (n: number, q: string) => {
  const params = new URLSearchParams();
  if (q.trim() !== "") params.set("q", q.trim());
  if (n > 1) params.set("page", String(n));
  const s = params.toString();
  return s ? `/posts?${s}` : "/posts";
};

/** First, last and current ±1, with "…" where the run is broken. Keeps the row
    a fixed width however long the archive gets. */
function pageWindow(page: number, pages: number): (number | "gap")[] {
  const wanted = new Set([1, pages, page - 1, page, page + 1]);
  const nums = [...wanted].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  let prev = 0;
  for (const n of nums) {
    if (prev && n - prev > 1) out.push("gap");
    out.push(n);
    prev = n;
  }
  return out;
}

const two = (n: number) => String(n).padStart(2, "0");

export default function PostsClient({
  posts,
  total,
  page,
  pages,
  perPage,
  q,
  archiveTotal,
  featured,
}: Props) {
  const listRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const router = useRouter();
  const pathname = usePathname();

  // Seeded from the URL so a shared `/posts?q=react` link opens with the box
  // already filled and the results already filtered server-side.
  const [search, setSearch] = useState(q);

  /* Typing commits to the URL on a pause, not per keystroke. Filtering runs on
     the server (the page is force-dynamic), so every character would otherwise
     be a round-trip that re-renders the list under the user's cursor.
     `scroll: false` keeps the viewport where it is while the results swap. */
  useEffect(() => {
    if (search === q) return;
    const t = setTimeout(() => {
      const params = new URLSearchParams();
      if (search.trim() !== "") params.set("q", search.trim());
      const s = params.toString();
      router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
    }, 300);
    return () => clearTimeout(t);
  }, [search, q, pathname, router]);

  /* A page change is a jump to different content, so return to the top — but
     not on first paint, which would fight the browser's own scroll
     restoration when the user navigates back. */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [page]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rows = listRef.current?.querySelectorAll(".post-row");
    if (!rows?.length) return;
    // clearProps so no inline transform is left behind to fight the row hover.
    const tween = gsap.from(rows, {
      opacity: 0, y: 14, stagger: 0.05, duration: 0.45, ease: "expo.out",
      clearProps: "opacity,transform",
    });
    return () => {
      tween.kill();
    };
  }, [page, q]);

  const filtered = q.trim() !== "";
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = (page - 1) * perPage + posts.length;

  return (
    <div>
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
            <h1 className="type-title" style={{ color: "var(--color-foreground)" }}>
              Posts
            </h1>
            <span className="type-index">
              {filtered ? `${total} of ${archiveTotal} articles` : `${archiveTotal} articles`}
            </span>
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

        {/* ── Featured post — pinned above the list, unfiltered view only ── */}
        {featured && (
          <Link
            href={`/posts/${featured.slug}`}
            className="col"
            style={{
              display: "grid",
              paddingBlock: "2.5rem",
              borderBottom: "1px solid var(--color-border)",
              gridTemplateColumns: "1fr auto",
              gap: "2rem",
              alignItems: "start",
              textDecoration: "none",
            }}
          >
            <div>
              <span className="type-label" style={{ color: "var(--color-accentText)", display: "block", marginBottom: "0.75rem" }}>
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
                {featured.title}
              </h2>
              <p
                className="type-body"
                style={{ color: "var(--color-mutedForeground)", maxWidth: "52ch", fontSize: "0.9rem", marginBottom: "1rem" }}
              >
                {featured.excerpt}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {featured.tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem", paddingTop: "0.25rem", minWidth: "5rem" }}>
              <span className="type-index">{featured.date}</span>
              <span className="type-index">{featured.readTime} min</span>
              <ArrowUpRight size={16} strokeWidth={1.5} style={{ color: "var(--color-accentText)", marginTop: "0.5rem" }} />
            </div>
          </Link>
        )}

        {/* ── Post list — each row is a Link ── */}
        <div ref={listRef} className="col">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/posts/${p.slug}`}
              className="post-row list-row row-hover"
              style={{
                borderBottom: "1px solid var(--color-border)",
                paddingBlock: "1.5rem",
                textDecoration: "none",
              }}
            >
              <span className="type-index" style={{ paddingTop: "0.2rem" }}>
                {two(p.n)}
              </span>

              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-medium)",
                    fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
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

          {posts.length === 0 && (
            <p className="type-body py-12" style={{ color: "var(--color-mutedForeground)" }}>
              {filtered ? `Nothing matches “${q.trim()}”.` : "Nothing found."}
            </p>
          )}
        </div>

        {/* ── Pagination ── */}
        {pages > 1 && (
          <nav
            className="col pagination"
            aria-label="Pagination"
            style={{ borderTop: "1px solid var(--color-border)" }}
          >
            <span className="type-index">
              {two(from)}–{two(to)} of {two(total)}
            </span>

            <div className="pagination-pages">
              {page > 1 ? (
                <Link href={pageHref(page - 1, q)} className="page-link" rel="prev" aria-label="Previous page">
                  <ChevronLeft size={15} strokeWidth={1.5} />
                </Link>
              ) : (
                <span className="page-link is-disabled" aria-hidden="true">
                  <ChevronLeft size={15} strokeWidth={1.5} />
                </span>
              )}

              {pageWindow(page, pages).map((n, i) =>
                n === "gap" ? (
                  <span key={`gap-${i}`} className="page-gap" aria-hidden="true">…</span>
                ) : (
                  <Link
                    key={n}
                    href={pageHref(n, q)}
                    className={`page-link${n === page ? " is-current" : ""}`}
                    aria-current={n === page ? "page" : undefined}
                    aria-label={`Page ${n}`}
                  >
                    {two(n)}
                  </Link>
                )
              )}

              {page < pages ? (
                <Link href={pageHref(page + 1, q)} className="page-link" rel="next" aria-label="Next page">
                  <ChevronRight size={15} strokeWidth={1.5} />
                </Link>
              ) : (
                <span className="page-link is-disabled" aria-hidden="true">
                  <ChevronRight size={15} strokeWidth={1.5} />
                </span>
              )}
            </div>
          </nav>
        )}
      </main>
      <Footer />
    </div>
  );
}
