"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { AiOutlineGithub } from "react-icons/ai";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import type { Project } from "@/lib/types";

export default function ProjectDetailClient({
  project,
  related,
}: {
  project: Project | null;
  related: Project[];
}) {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) return;
    const ctx = gsap.context(() => {
      gsap.from(".proj-content > *", {
        opacity: 0, y: 20, duration: 0.6, stagger: 0.07, ease: "expo.out",
      });
    }, pageRef);
    return () => ctx.revert();
  }, [project]);

  if (!project) {
    return (
      <div style={{ paddingTop: "8rem" }}>
        <div className="col" style={{ paddingBlock: "4rem" }}>
          <p className="type-label mb-4" style={{ color: "var(--color-accent)" }}>404</p>
          <h1 className="type-title" style={{ color: "var(--color-foreground)", marginBottom: "1.5rem" }}>
            Project not found.
          </h1>
          <Link href="/project" className="type-label link-draw" style={{ color: "var(--color-foreground)", textDecoration: "none" }}>
            ← Back to projects
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div ref={pageRef}>
      <main style={{ paddingTop: "5rem" }}>

        {/* ── Header ── */}
        <div
          className="col"
          style={{ paddingTop: "2.5rem", paddingBottom: "2rem", borderBottom: "1px solid var(--color-border)" }}
        >
          <Link
            href="/project"
            className="type-label link-draw flex items-center gap-1.5 mb-6"
            style={{ color: "var(--color-mutedForeground)", textDecoration: "none", width: "fit-content" }}
          >
            <ArrowLeft size={11} strokeWidth={2} />
            Projects
          </Link>

          <div
            className="split-aside"
            style={{
              ["--split-gap" as string]: "3rem",
            }}
          >
            {/* Title block */}
            <div>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {project.tags.map((t) => (
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
                  maxWidth: "20ch",
                  marginBottom: "1.25rem",
                }}
              >
                {project.title}
              </h1>
              <p className="type-body" style={{ color: "var(--color-mutedForeground)", maxWidth: "52ch" }}>
                {project.summary}
              </p>

              {/* External links */}
              <div className="flex flex-wrap gap-4 mt-6">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="type-label link-draw flex items-center gap-1.5"
                    style={{ color: "var(--color-foreground)", textDecoration: "none" }}
                  >
                    <AiOutlineGithub size={13} />
                    View code
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target={project.live.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="type-label link-draw flex items-center gap-1.5"
                    style={{ color: "var(--color-accent)", textDecoration: "none" }}
                  >
                    <ArrowUpRight size={11} strokeWidth={2} />
                    Live site
                  </a>
                )}
              </div>
            </div>

            {/* Glass meta panel */}
            <div
              className="glass-panel-strong"
              style={{ padding: "1.25rem", borderRadius: "2px" }}
            >
              {[
                { label: "Year",   value: project.year },
                { label: "Role",   value: project.role },
                { label: "Status", value: project.status },
              ].map(({ label, value }, i, arr) => (
                <div key={label}>
                  <div style={{ paddingBlock: "0.75rem" }}>
                    <p className="type-index mb-0.5">{label}</p>
                    <p style={{ fontFamily: "var(--font-medium)", fontSize: "0.875rem", color: "var(--color-foreground)" }}>
                      {value}
                    </p>
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ height: "1px", backgroundColor: "var(--color-border)" }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Body — two column ── */}
        <div
          className="col proj-content split-aside"
          style={{
            paddingBlock: "3rem",
            ["--split-gap" as string]: "3rem",
          }}
        >
          {/* Main content */}
          <div>
            {/* Challenge */}
            <div style={{ marginBottom: "2.5rem" }}>
              <h2
                style={{
                  fontFamily: "var(--font-editorial)",
                  fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
                  letterSpacing: "-0.025em",
                  color: "var(--color-foreground)",
                  marginBottom: "0.75rem",
                }}
              >
                The challenge
              </h2>
              <p className="type-body" style={{ color: "var(--color-foreground)", maxWidth: "62ch" }}>
                {project.challenge}
              </p>
            </div>

            {/* Solution */}
            <div style={{ marginBottom: "2.5rem" }}>
              <h2
                style={{
                  fontFamily: "var(--font-editorial)",
                  fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
                  letterSpacing: "-0.025em",
                  color: "var(--color-foreground)",
                  marginBottom: "0.75rem",
                }}
              >
                The solution
              </h2>
              <p className="type-body" style={{ color: "var(--color-foreground)", maxWidth: "62ch" }}>
                {project.solution}
              </p>
            </div>

            {/* Outcome */}
            <blockquote
              style={{
                borderLeft: "2px solid var(--color-accent)",
                paddingLeft: "1.5rem",
                marginBottom: "2.5rem",
                fontFamily: "var(--font-editorial)",
                fontSize: "clamp(1.1rem, 1.8vw, 1.3rem)",
                letterSpacing: "-0.02em",
                color: "var(--color-foreground)",
                maxWidth: "50ch",
                lineHeight: 1.4,
              }}
            >
              {project.outcome}
            </blockquote>
          </div>

          {/* Side — stack breakdown */}
          <aside style={{ position: "sticky", top: "5rem" }}>
            <div
              className="glass-panel-strong"
              style={{ padding: "1.25rem", borderRadius: "2px" }}
            >
              <p className="type-index mb-4">Tech stack</p>
              {project.stack.map(({ layer, tools }, i) => (
                <div key={layer}>
                  <div style={{ paddingBlock: "0.75rem" }}>
                    <p className="type-index mb-2" style={{ color: "var(--color-accent)" }}>{layer}</p>
                    <div className="flex flex-wrap gap-1">
                      {tools.map((tool) => (
                        <span key={tool} className="tag" style={{ fontSize: "0.5625rem" }}>{tool}</span>
                      ))}
                    </div>
                  </div>
                  {i < project.stack.length - 1 && (
                    <div style={{ height: "1px", backgroundColor: "var(--color-border)" }} />
                  )}
                </div>
              ))}
            </div>
          </aside>
        </div>

        {/* ── Related projects ── */}
        {related.length > 0 && (
          <div
            className="col"
            style={{ paddingBlock: "3rem", borderTop: "1px solid var(--color-border)" }}
          >
            <p className="type-label mb-6">
              <span style={{ color: "var(--color-accent)", marginRight: "0.5em" }}>More projects</span>
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 22rem), 1fr))",
              gap: "1px",
              border: "1px solid var(--color-border)",
            }}>
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/project/${r.slug}`}
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
                    {r.tags?.slice(0, 3).map((t: string) => (
                      <span key={t} className="tag" style={{ fontSize: "0.5625rem" }}>{t}</span>
                    ))}
                  </div>
                  <p style={{
                    fontFamily: "var(--font-medium)",
                    fontSize: "1rem",
                    color: "var(--color-foreground)",
                    lineHeight: 1.3,
                    letterSpacing: "-0.01em",
                    marginBottom: "0.5rem",
                  }}>
                    {r.title}
                  </p>
                  <p className="type-index">{r.year} · {r.role}</p>
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
