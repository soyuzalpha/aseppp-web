"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowUpRight } from "lucide-react";
import { AiOutlineGithub } from "react-icons/ai";
import Link from "next/link";
import Footer from "@/components/layout/Footer";

const PROJECTS = [
  {
    n: "01",
    slug: "ecommerce-platform",
    title: "E-Commerce Platform",
    year: "2024",
    tags: ["Next.js", "Node.js", "Stripe", "PostgreSQL"],
    desc: "Full-stack storefront with product catalog, cart, Stripe checkout, order management, and admin dashboard. Handles 10k+ SKUs.",
    github: "https://github.com/aseppp",
    live: null as string | null,
    role: "Fullstack",
    status: "Live",
  },
  {
    n: "02",
    slug: "ops-dashboard",
    title: "Ops Dashboard",
    year: "2024",
    tags: ["React", "Socket.io", "Redis", "TypeScript"],
    desc: "Real-time logistics monitoring with WebSocket updates, interactive charts, and role-based access control. 50k+ daily requests in production.",
    github: "https://github.com/aseppp",
    live: null as string | null,
    role: "Fullstack",
    status: "Live",
  },
  {
    n: "03",
    slug: "api-boilerplate",
    title: "REST API Boilerplate",
    year: "2023",
    tags: ["Node.js", "Express", "Prisma", "Jest"],
    desc: "Production-ready Node.js API starter with JWT auth, rate limiting, input validation, Swagger docs, and 90%+ test coverage.",
    github: "https://github.com/aseppp",
    live: null as string | null,
    role: "Backend",
    status: "Open source",
  },
  {
    n: "04",
    slug: "blog-cms",
    title: "Blog CMS",
    year: "2023",
    tags: ["Next.js", "MDX", "Vercel", "Tailwind"],
    desc: "Headless CMS with MDX content, tag system, full-text search, and Incremental Static Regeneration. Sub-800ms load time.",
    github: "https://github.com/aseppp",
    live: null as string | null,
    role: "Frontend",
    status: "Live",
  },
  {
    n: "05",
    slug: "task-manager",
    title: "Task Manager",
    year: "2023",
    tags: ["React", "Redux", "Node.js", "Socket.io"],
    desc: "Drag-and-drop kanban board with real-time team updates via WebSocket, notifications, and user authentication.",
    github: "https://github.com/aseppp",
    live: null as string | null,
    role: "Fullstack",
    status: "Live",
  },
  {
    n: "06",
    slug: "analytics-dashboard",
    title: "Analytics Dashboard",
    year: "2024",
    tags: ["React", "Chart.js", "TypeScript"],
    desc: "Data visualization dashboard with filterable charts, date range pickers, and CSV/PDF export. Built for a logistics client.",
    github: "https://github.com/aseppp",
    live: null as string | null,
    role: "Frontend",
    status: "WIP",
  },
  {
    n: "07",
    slug: "portfolio",
    title: "This Portfolio",
    year: "2024",
    tags: ["Next.js", "GSAP", "TypeScript"],
    desc: "The site you're on — editorial layout, custom cursor, multi-theme system, GSAP scroll animations, horizontal scroll projects.",
    github: "https://github.com/aseppp",
    live: "/" as string | null,
    role: "Design + Dev",
    status: "Live",
  },
];

const ALL_ROLES = ["All", ...Array.from(new Set(PROJECTS.map((p) => p.role)))];

export default function ProjectsPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState("All");

  const items = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.role === filter);

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
          <p className="type-label mb-3" style={{ color: "var(--color-accent)" }}>
            Work
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
          {ALL_ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setFilter(r)}
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
              className="project-row"
              style={{
                display: "grid",
                borderBottom: "1px solid var(--color-border)",
                paddingBlock: "1.75rem",
                gridTemplateColumns: "2.5rem 1fr auto",
                gap: "1.5rem 2rem",
                alignItems: "start",
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
                      borderRadius: "999px",
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "0.5rem",
                  paddingTop: "0.15rem",
                }}
              >
                <span className="type-index">{p.year}</span>
                <span
                  className="type-label"
                  style={{
                    color: "var(--color-mutedForeground)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "999px",
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
