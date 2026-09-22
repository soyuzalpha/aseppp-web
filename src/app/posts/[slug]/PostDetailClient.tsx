"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import type { Post } from "@/lib/types";

export default function PostDetailClient({
  post,
  related,
}: {
  post: Post | null;
  related: Post[];
}) {

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
            className="split-aside"
            style={{ ["--split-gap" as string]: "3rem", minWidth: 0 }}
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
          className="col post-content split-aside"
          style={{ paddingBlock: "3rem", ["--split-gap" as string]: "3rem" }}
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
