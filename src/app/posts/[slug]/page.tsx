"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowLeft, Clock, Calendar, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import Footer from "@/components/layout/Footer";

/* ── Post data (would come from MDX/CMS in production) ── */
const POSTS: Record<string, {
  title: string;
  date: string;
  readTime: number;
  tags: string[];
  excerpt: string;
  body: { type: "p" | "h2" | "h3" | "code" | "blockquote" | "ul"; content: string | string[] }[];
}> = {
  "theme-system-nextjs": {
    title: "Building a theme system with CSS variables in Next.js",
    date: "Aug 15, 2024",
    readTime: 8,
    tags: ["Next.js", "CSS", "React"],
    excerpt: "How to build a flexible multi-theme system using CSS custom properties and React context — no libraries required.",
    body: [
      { type: "p", content: "CSS custom properties (variables) are the most underrated tool in a frontend developer's arsenal. Combined with React context, they let you build a theme system that is fast, flexible, and requires zero runtime overhead." },
      { type: "h2", content: "Why not a library?" },
      { type: "p", content: "Libraries like Styled-Components, Emotion, or even Stitches add kilobytes of runtime JavaScript to solve a problem that CSS already solves natively. CSS variables update instantly, cascade correctly, and work with any styling approach — Tailwind, CSS Modules, inline styles, whatever you prefer." },
      { type: "h2", content: "The structure" },
      { type: "p", content: "The system has three layers: design tokens as CSS variables on :root, a theme map in TypeScript, and a React context that applies the chosen theme's values to the DOM." },
      { type: "code", content: `:root {\n  --color-background: #f4f3ef;\n  --color-foreground: #1a1a1a;\n  --color-accent: #c84b31;\n}\n\n.dark {\n  --color-background: #111110;\n  --color-foreground: #f0ede8;\n  --color-accent: #e05c3f;\n}` },
      { type: "h2", content: "The React context" },
      { type: "p", content: "The ThemeProvider reads localStorage on mount, applies the chosen theme's variables directly to document.documentElement, and exposes setTheme and toggleMode to child components. No re-renders required for color changes — the CSS variable update handles everything." },
      { type: "code", content: `useEffect(() => {\n  const root = document.documentElement;\n  Object.entries(colors).forEach(([key, value]) => {\n    root.style.setProperty(\`--color-\${key}\`, value);\n  });\n}, [colors]);` },
      { type: "h2", content: "Multiple themes, same system" },
      { type: "p", content: "Because every color in the UI reads from a CSS variable, adding a new theme is just adding a new object to the theme map. No component changes needed. This is the power of separating data from presentation." },
      { type: "blockquote", content: "The best theme system is the one you forget is there — it just works, for every theme, everywhere." },
      { type: "h2", content: "Performance" },
      { type: "p", content: "CSS variable updates happen in a single paint. No JavaScript reconciliation. No virtual DOM diffing. The browser handles it natively. This is why theme switching feels instant — because it is." },
      { type: "ul", content: ["No flicker on initial load when using localStorage + SSR", "Works with Tailwind's dark: variant via the .dark class", "Each theme can override any subset of variables", "Type-safe via TypeScript interfaces"] },
    ],
  },
  "gsap-scroll-animations": {
    title: "GSAP scroll animations that actually feel good",
    date: "Jul 20, 2024",
    readTime: 6,
    tags: ["GSAP", "Animation", "React"],
    excerpt: "Practical patterns for smooth, purposeful scroll-triggered animations in React without over-engineering.",
    body: [
      { type: "p", content: "Most scroll animations I see on portfolios fall into one of two traps: either they're so subtle you barely notice them, or they're so aggressive that the page feels broken. Good scroll animation has one job: direct attention to what matters, when it matters." },
      { type: "h2", content: "The golden rule" },
      { type: "p", content: "Animate things that benefit from animation. A heading appearing as you scroll to it is meaningful — the motion reinforces that this content is new. A button spinning on hover is noise." },
      { type: "h2", content: "Setting up GSAP with React" },
      { type: "p", content: "The critical thing in React is using gsap.context() to scope your animations and calling ctx.revert() on cleanup. This prevents memory leaks and stale animation state on route changes." },
      { type: "code", content: `useEffect(() => {\n  const ctx = gsap.context(() => {\n    gsap.from('.card', {\n      y: 40,\n      opacity: 0,\n      stagger: 0.08,\n      duration: 0.7,\n      ease: 'expo.out',\n      scrollTrigger: {\n        trigger: '.cards',\n        start: 'top 85%',\n      },\n    });\n  }, ref);\n  return () => ctx.revert();\n}, []);` },
      { type: "h2", content: "Easing matters more than duration" },
      { type: "p", content: "expo.out is your best friend. It starts fast and decelerates naturally — the way physical objects actually move. A 0.7s expo.out feels snappier than a 0.3s linear animation." },
      { type: "blockquote", content: "Duration is how long. Easing is how it feels. Get the easing right and the duration barely matters." },
    ],
  },
  "nodejs-api-best-practices": {
    title: "Node.js API architecture for 2024",
    date: "Jun 10, 2024",
    readTime: 10,
    tags: ["Node.js", "Backend", "API"],
    excerpt: "Rate limiting, structured error handling, input validation, and logging patterns I use in every production API.",
    body: [
      { type: "p", content: "I've built Node.js APIs for startups, agencies, and solo projects. After enough production incidents, you develop opinions. These are mine — battle-tested patterns that I now apply from day one." },
      { type: "h2", content: "Structured error handling" },
      { type: "p", content: "Every API error should have a machine-readable code, a human-readable message, and an HTTP status. Never throw raw Error objects — create an AppError class that serializes cleanly." },
      { type: "code", content: `class AppError extends Error {\n  constructor(\n    public code: string,\n    public message: string,\n    public status: number = 400,\n  ) {\n    super(message);\n  }\n}\n\n// Usage\nthrow new AppError('USER_NOT_FOUND', 'No user with that ID', 404);` },
      { type: "h2", content: "Input validation at the boundary" },
      { type: "p", content: "Validate every request before it touches business logic. I use Zod because it gives you TypeScript types for free from the same schema definition. The parse happens in middleware — if it fails, a 400 is returned automatically." },
      { type: "h2", content: "Rate limiting is not optional" },
      { type: "p", content: "express-rate-limit with a Redis store. Different limits for different routes — auth endpoints get stricter limits than read-only data endpoints. Apply it globally with a more generous default, then tighten specific routes." },
      { type: "ul", content: ["100 req/15min for most routes", "10 req/15min for /auth/* routes", "5 req/hour for password reset", "Separate limits for authenticated vs anonymous"] },
      { type: "blockquote", content: "Your API is only as reliable as its weakest boundary. Most attacks target the boundary." },
    ],
  },
};

const RELATED: Record<string, string[]> = {
  "theme-system-nextjs": ["gsap-scroll-animations", "nodejs-api-best-practices"],
  "gsap-scroll-animations": ["theme-system-nextjs", "nodejs-api-best-practices"],
  "nodejs-api-best-practices": ["theme-system-nextjs", "gsap-scroll-animations"],
};

export default function PostDetail() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const post = POSTS[slug];

  const pageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!post) return;
    const ctx = gsap.context(() => {
      gsap.from(".post-content > *", {
        opacity: 0, y: 20, duration: 0.6, stagger: 0.06, ease: "expo.out",
      });
    }, pageRef);
    return () => ctx.revert();
  }, [post]);

  if (!post) {
    return (
      <div style={{ paddingTop: "8rem" }}>
        <div className="col" style={{ paddingBlock: "4rem" }}>
          <p className="type-label mb-4" style={{ color: "var(--color-accent)" }}>404</p>
          <h1 className="type-title" style={{ color: "var(--color-foreground)", marginBottom: "1.5rem" }}>
            Post not found.
          </h1>
          <Link href="/posts" className="type-label link-draw" style={{ color: "var(--color-foreground)", textDecoration: "none" }}>
            ← Back to posts
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const related = (RELATED[slug] ?? []).map((s) => ({ slug: s, ...POSTS[s] })).filter(Boolean);

  return (
    <div ref={pageRef}>
      {/* Reading progress bar */}
      <div
        ref={progressRef}
        style={{
          position: "fixed",
          top: "3.5rem",
          left: 0,
          height: "2px",
          width: `${progress}%`,
          backgroundColor: "var(--color-accent)",
          zIndex: 49,
          transition: "width 0.1s linear",
        }}
        aria-hidden="true"
      />

      <main style={{ paddingTop: "5rem" }}>
        {/* ── Header ── */}
        <div
          className="col"
          style={{ paddingTop: "2.5rem", paddingBottom: "2rem", borderBottom: "1px solid var(--color-border)" }}
        >
          <Link
            href="/posts"
            className="type-label link-draw flex items-center gap-1.5 mb-6"
            style={{ color: "var(--color-mutedForeground)", textDecoration: "none", width: "fit-content" }}
          >
            <ArrowLeft size={11} strokeWidth={2} />
            Posts
          </Link>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr clamp(12rem, 22vw, 18rem)",
              gap: "3rem",
              alignItems: "start",
              minWidth: 0,
            }}
          >
            {/* Title */}
            <div>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {post.tags.map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
              <h1
                style={{
                  fontFamily: "var(--font-editorial)",
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  lineHeight: 1.02,
                  letterSpacing: "-0.03em",
                  color: "var(--color-foreground)",
                  maxWidth: "22ch",
                }}
              >
                {post.title}
              </h1>
              <p
                className="type-body mt-4"
                style={{ color: "var(--color-mutedForeground)", maxWidth: "52ch" }}
              >
                {post.excerpt}
              </p>
            </div>

            {/* Meta glass panel */}
            <div
              className="glass-panel-strong"
              style={{
                padding: "1.25rem",
                borderRadius: "2px",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div>
                <p className="type-index mb-0.5">Published</p>
                <p style={{ fontFamily: "var(--font-medium)", fontSize: "0.875rem", color: "var(--color-foreground)" }}>
                  {post.date}
                </p>
              </div>
              <div style={{ height: "1px", backgroundColor: "var(--color-border)" }} />
              <div>
                <p className="type-index mb-0.5">Reading time</p>
                <p style={{ fontFamily: "var(--font-medium)", fontSize: "0.875rem", color: "var(--color-foreground)" }}>
                  {post.readTime} min read
                </p>
              </div>
              <div style={{ height: "1px", backgroundColor: "var(--color-border)" }} />
              <div>
                <p className="type-index mb-1.5">Topics</p>
                <div className="flex flex-wrap gap-1">
                  {post.tags.map((t) => (
                    <span key={t} className="tag" style={{ fontSize: "0.5625rem" }}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{ height: "1px", backgroundColor: "var(--color-border)" }} />
              <div>
                <p className="type-index mb-1">Progress</p>
                <div style={{ height: "2px", backgroundColor: "var(--color-border)", borderRadius: "1px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${progress}%`,
                      backgroundColor: "var(--color-accent)",
                      transition: "width 0.1s linear",
                    }}
                  />
                </div>
                <p className="type-index mt-1" style={{ textAlign: "right" }}>{Math.round(progress)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div
          className="col post-content"
          style={{
            paddingBlock: "3rem",
            display: "grid",
            gridTemplateColumns: "1fr clamp(12rem, 22vw, 18rem)",
            gap: "3rem",
            alignItems: "start",
          }}
        >
          {/* Article body */}
          <article style={{ minWidth: 0 }}>
            {post.body.map((block, i) => {
              if (block.type === "p") return (
                <p key={i} className="type-body mb-5" style={{ color: "var(--color-foreground)" }}>
                  {block.content as string}
                </p>
              );
              if (block.type === "h2") return (
                <h2 key={i}
                  style={{
                    fontFamily: "var(--font-editorial)",
                    fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                    letterSpacing: "-0.025em",
                    color: "var(--color-foreground)",
                    marginTop: "3rem",
                    marginBottom: "1rem",
                    lineHeight: 1.1,
                  }}
                >
                  {block.content as string}
                </h2>
              );
              if (block.type === "h3") return (
                <h3 key={i}
                  style={{
                    fontFamily: "var(--font-medium)",
                    fontSize: "1.1rem",
                    color: "var(--color-foreground)",
                    marginTop: "2rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  {block.content as string}
                </h3>
              );
              if (block.type === "code") return (
                <div
                  key={i}
                  className="glass-panel"
                  style={{
                    marginBlock: "1.5rem",
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "0.5rem 1rem",
                      borderBottom: "1px solid var(--color-border)",
                      display: "flex",
                      gap: "6px",
                    }}
                    aria-hidden="true"
                  >
                    {["#c84b31","#d4a017","#4aad52"].map((c) => (
                      <span key={c} style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: c, display: "inline-block" }} />
                    ))}
                  </div>
                  <pre
                    style={{
                      padding: "1.25rem",
                      overflowX: "auto",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.8125rem",
                      lineHeight: 1.7,
                      color: "var(--color-foreground)",
                      margin: 0,
                    }}
                  >
                    <code>{block.content as string}</code>
                  </pre>
                </div>
              );
              if (block.type === "blockquote") return (
                <blockquote
                  key={i}
                  style={{
                    borderLeft: "2px solid var(--color-accent)",
                    paddingLeft: "1.5rem",
                    marginBlock: "2rem",
                    fontFamily: "var(--font-editorial)",
                    fontSize: "clamp(1.1rem, 1.8vw, 1.35rem)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.4,
                    color: "var(--color-foreground)",
                    fontStyle: "italic",
                  }}
                >
                  {block.content as string}
                </blockquote>
              );
              if (block.type === "ul") return (
                <ul key={i} style={{ marginBlock: "1.25rem", paddingLeft: 0, listStyle: "none" }}>
                  {(block.content as string[]).map((item) => (
                    <li
                      key={item}
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                        paddingBlock: "0.5rem",
                        borderBottom: "1px solid var(--color-border)",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.9rem",
                        color: "var(--color-foreground)",
                      }}
                    >
                      <span style={{ color: "var(--color-accent)", flexShrink: 0, marginTop: "0.25rem" }}>—</span>
                      {item}
                    </li>
                  ))}
                </ul>
              );
              return null;
            })}
          </article>

          {/* Side sticky — empty on mobile, shows on desktop */}
          <aside
            style={{ position: "sticky", top: "5rem" }}
            className="hidden lg:block"
          >
            <div
              className="glass-panel-strong"
              style={{ padding: "1.25rem", borderRadius: "2px" }}
            >
              <p className="type-index mb-3">In this post</p>
              {post.body.filter((b) => b.type === "h2").map((b, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8125rem",
                    color: "var(--color-mutedForeground)",
                    paddingBlock: "0.4rem",
                    borderBottom: "1px solid var(--color-border)",
                    lineHeight: 1.4,
                  }}
                >
                  {b.content as string}
                </p>
              ))}
            </div>
          </aside>
        </div>

        {/* ── Related posts ── */}
        {related.length > 0 && (
          <div
            className="col"
            style={{ paddingBlock: "3rem", borderTop: "1px solid var(--color-border)" }}
          >
            <p className="type-label mb-6">
              <span style={{ color: "var(--color-accent)", marginRight: "0.5em" }}>More posts</span>
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 22rem), 1fr))", gap: "1px", border: "1px solid var(--color-border)" }}>
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/posts/${r.slug}`}
                  className="glass-hover"
                  style={{
                    display: "block",
                    padding: "1.5rem",
                    textDecoration: "none",
                    background: "color-mix(in srgb, var(--color-card) 60%, transparent)",
                    backdropFilter: "blur(12px)",
                    borderRight: "1px solid var(--color-border)",
                  }}
                >
                  <div className="flex flex-wrap gap-1 mb-3">
                    {r.tags?.map((t: string) => <span key={t} className="tag" style={{ fontSize: "0.5625rem" }}>{t}</span>)}
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-medium)",
                      fontSize: "1rem",
                      color: "var(--color-foreground)",
                      lineHeight: 1.3,
                      letterSpacing: "-0.01em",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {r.title}
                  </p>
                  <p className="type-index">{r.date} · {r.readTime} min</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
