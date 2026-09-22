"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowUpRight } from "lucide-react";
import { AiOutlineGithub } from "react-icons/ai";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import SectionLabel from "@/components/ui/SectionLabel";
import type { Project } from "@/lib/types";

export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const pageRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState("All");

  const allRoles = ["All", ...Array.from(new Set(projects.map((p) => p.role)))];
  const items = filter === "All" ? projects : projects.filter((p) => p.role === filter);

  useEffect(() => {
    gsap.from(listRef.current?.querySelectorAll(".project-row") ?? [], {
      opacity: 0,
      y: 16,
      stagger: 0.06,
      duration: 0.55,
      ease: "expo.out",
    });
  }, [filter]);

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
            <SectionLabel n="02">Work</SectionLabel>
          </p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <h1 className="type-title page-title" style={{ color: "var(--color-foreground)" }}>
              Projects
            </h1>
            <span className="type-index">{items.length} projects</span>
          </div>
        </div>

        {/* ── Filters ── */}
        <div
          className="col flex flex-wrap gap-x-6 gap-y-2"
          style={{ paddingBlock: "1.25rem", borderBottom: "1px solid var(--color-border)" }}
        >
          {allRoles.map((r) => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className="tap-target"
              style={{
                background: "none",
                border: "none",
                padding: "0.2rem 0",
                fontFamily: "var(--font-body)",
                fontSize: "0.6875rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontWeight: 500,
                color: filter === r ? "var(--color-foreground)" : "var(--color-mutedForeground)",
                borderBottom: filter === r ? "1px solid var(--color-accent)" : "1px solid transparent",
                transition: "color 0.2s ease",
              }}
            >
              {r}
            </button>
          ))}
        </div>

        {/* ── Project list — each row is a Link ── */}
        <div ref={listRef} className="col">
          {items.map((p) => (
            <Link
              key={p.slug}
              href={`/project/${p.slug}`}
              className="project-row list-row"
              style={{
                borderBottom: "1px solid var(--color-border)",
                paddingBlock: "1.75rem",
                textDecoration: "none",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  "color-mix(in srgb, var(--color-foreground) 3%, transparent)")
              }
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent")}
            >
              {/* Number */}
              <span className="type-index" style={{ paddingTop: "0.25rem" }}>
                {p.n}
              </span>

              {/* Content */}
              <div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "baseline",
                    gap: "0.75rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "var(--font-editorial)",
                      fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                      letterSpacing: "-0.02em",
                      color: "var(--color-foreground)",
                      lineHeight: 1.1,
                    }}
                  >
                    {p.title}
                  </h2>
                  <span
                    className="type-label"
                    style={{
                      color: "var(--color-accent)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "2px",
                      padding: "0.15rem 0.6rem",
                    }}
                  >
                    {p.status}
                  </span>
                </div>
                <p
                  className="type-body"
                  style={{
                    color: "var(--color-mutedForeground)",
                    maxWidth: "58ch",
                    fontSize: "0.875rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  {p.desc}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right — year + role + links */}
              <div className="list-row-meta">
                <span className="type-index">{p.year}</span>
                <span
                  className="type-label"
                  style={{
                    color: "var(--color-mutedForeground)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "2px",
                    padding: "0.15rem 0.6rem",
                  }}
                >
                  {p.role}
                </span>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        color: "var(--color-mutedForeground)",
                        textDecoration: "none",
                        transition: "color 0.2s ease",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLAnchorElement).style.color = "var(--color-foreground)")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLAnchorElement).style.color = "var(--color-mutedForeground)")
                      }
                    >
                      <AiOutlineGithub size={16} />
                    </a>
                  )}
                  <ArrowUpRight size={15} strokeWidth={1.5} style={{ color: "var(--color-mutedForeground)" }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
