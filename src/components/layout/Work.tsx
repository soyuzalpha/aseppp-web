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
  const secRef  = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headRef.current, {
        opacity: 0, y: 24, duration: 0.7, ease: "expo.out",
        scrollTrigger: { trigger: headRef.current, start: "top 88%" },
      });
    }, secRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={secRef} aria-labelledby="work-label" className="section">
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

      {/* Scroll stack — each card sticks below the previous one, so the deck
          visibly piles up as you scroll. See .stack-card in globals.css. */}
      <div className="col">
        <div className="stack-deck">
          {PROJECTS.map((p, i) => (
            <Link
              key={p.n}
              href={p.href}
              className="stack-card"
              style={{ ["--i" as string]: i }}
            >
              <div className="flex items-start justify-between">
                <span className="type-index" style={{ fontSize: "0.75rem", letterSpacing: "0.08em" }}>
                  {p.n}
                </span>
                <span
                  className="type-label"
                  style={{
                    color: "var(--color-accentText)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "2px",
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
                    fontSize: "clamp(1.6rem, 5vw, 3rem)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.025em",
                    marginBottom: "0.75rem",
                  }}
                >
                  {p.title}
                </h3>
                <p
                  className="type-body"
                  style={{ color: "var(--color-mutedForeground)", fontSize: "0.875rem", maxWidth: "46ch" }}
                >
                  {p.desc}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="type-index">{p.year}</span>
                  <ArrowUpRight className="stack-arrow" size={16} strokeWidth={1.5} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
