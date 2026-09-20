"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import SectionLabel from "@/components/ui/SectionLabel";

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    n: "01",
    title: "E-Commerce Platform",
    year: "2024",
    tags: ["Next.js", "Node.js", "Stripe", "PostgreSQL"],
    desc: "Full-stack storefront — product catalog, checkout, order management, and admin panel. Handles 10k+ SKUs.",
    href: "/project/ecommerce-platform",
    role: "Fullstack",
  },
  {
    n: "02",
    title: "Ops Dashboard",
    year: "2024",
    tags: ["React", "Socket.io", "Redis"],
    desc: "Real-time logistics monitoring with WebSocket updates and role-based access. 50k+ daily requests in prod.",
    href: "/project/ops-dashboard",
    role: "Fullstack",
  },
  {
    n: "03",
    title: "API Boilerplate",
    year: "2023",
    tags: ["Node.js", "Prisma", "Jest"],
    desc: "Production-ready Node.js starter — JWT auth, rate limiting, Swagger docs, 90%+ test coverage.",
    href: "/project/api-boilerplate",
    role: "Backend",
  },
  {
    n: "04",
    title: "Blog CMS",
    year: "2023",
    tags: ["Next.js", "MDX", "Vercel"],
    desc: "Headless CMS with MDX content, tag system, full-text search, and ISR. Loads in under 800ms.",
    href: "/project/blog-cms",
    role: "Frontend",
  },
  {
    n: "05",
    title: "This Portfolio",
    year: "2024",
    tags: ["Next.js", "GSAP", "TypeScript"],
    desc: "What you're looking at — editorial layout, multi-theme system, custom cursor, GSAP scroll animations.",
    href: "/project/portfolio",
    role: "Design + Dev",
  },
];

export default function Work() {
  const secRef   = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headRef.current, {
        opacity: 0, y: 24, duration: 0.7, ease: "expo.out",
        scrollTrigger: { trigger: headRef.current, start: "top 88%" },
      });
      const cards = trackRef.current?.querySelectorAll(".work-card");
      if (cards) {
        gsap.from(cards, {
          opacity: 0, x: 60, duration: 0.7, stagger: 0.1, ease: "expo.out",
          scrollTrigger: { trigger: trackRef.current, start: "top 82%" },
        });
      }
    }, secRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={secRef} aria-labelledby="work-label" style={{ paddingBlock: "5rem" }}>
      {/* Header */}
      <div
        ref={headRef}
        className="col flex items-baseline justify-between pb-5"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <span id="work-label">
          <SectionLabel n="02">Selected work</SectionLabel>
        </span>
        <Link
          href="/project"
          className="type-label link-draw"
          style={{ color: "var(--color-mutedForeground)", textDecoration: "none" }}
        >
          All projects →
        </Link>
      </div>

      {/* Horizontal scroll */}
      <div
        ref={trackRef}
        className="h-scroll-track"
        style={{ paddingInline: "var(--col-pad)", paddingBlock: "2.5rem", gap: "1px" }}
      >
        {PROJECTS.map((p) => (
          <Link
            key={p.n}
            href={p.href}
            className="work-card h-scroll-item group block"
            style={{
              width: "clamp(18rem, 32vw, 26rem)",
              textDecoration: "none",
              background: "color-mix(in srgb, var(--color-card) 70%, transparent)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid var(--color-border)",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "22rem",
              transition: "border-color 0.25s ease, background 0.25s ease, transform 0.3s var(--ease-spring)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = "var(--color-foreground)";
              el.style.background = "color-mix(in srgb, var(--color-card) 92%, transparent)";
              el.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = "var(--color-border)";
              el.style.background = "color-mix(in srgb, var(--color-card) 70%, transparent)";
              el.style.transform = "translateY(0)";
            }}
          >
            <div className="flex items-start justify-between">
              <span className="type-index" style={{ fontSize: "0.75rem", letterSpacing: "0.08em" }}>
                {p.n}
              </span>
              <span
                className="type-label"
                style={{
                  color: "var(--color-accent)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "999px",
                  padding: "0.2rem 0.7rem",
                }}
              >
                {p.role}
              </span>
            </div>

            <div>
              <h3
                style={{
                  fontFamily: "var(--font-editorial)",
                  fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.025em",
                  color: "var(--color-foreground)",
                  marginBottom: "0.75rem",
                }}
              >
                {p.title}
              </h3>
              <p className="type-body" style={{ color: "var(--color-mutedForeground)", fontSize: "0.875rem" }}>
                {p.desc}
              </p>
            </div>

            <div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
              <div className="flex items-center justify-between">
                <span className="type-index">{p.year}</span>
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.5}
                  style={{ color: "var(--color-mutedForeground)", transition: "transform 0.2s ease" }}
                />
              </div>
            </div>
          </Link>
        ))}

        {/* End cap */}
        <Link
          href="/project"
          className="h-scroll-item flex flex-col items-center justify-center gap-3"
          style={{
            width: "clamp(10rem, 16vw, 14rem)",
            minHeight: "22rem",
            textDecoration: "none",
            border: "1px dashed var(--color-border)",
            color: "var(--color-mutedForeground)",
            transition: "border-color 0.2s ease, color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.borderColor = "var(--color-foreground)";
            el.style.color = "var(--color-foreground)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.borderColor = "var(--color-border)";
            el.style.color = "var(--color-mutedForeground)";
          }}
        >
          <ArrowUpRight size={20} strokeWidth={1.5} />
          <span className="type-label" style={{ color: "inherit" }}>View all</span>
        </Link>
      </div>

      <div className="col mt-1">
        <p className="type-index" style={{ opacity: 0.5 }}>← drag or scroll horizontally</p>
      </div>
    </section>
  );
}
