"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { AiOutlineGithub } from "react-icons/ai";
import Link from "next/link";
import { useParams } from "next/navigation";
import Footer from "@/components/layout/Footer";

type ProjectDetail = {
  n: string;
  title: string;
  year: string;
  role: string;
  status: string;
  tags: string[];
  github: string;
  live: string | null;
  summary: string;
  challenge: string;
  solution: string;
  outcome: string;
  stack: { layer: string; tools: string[] }[];
  related: string[];
};

const PROJECTS: Record<string, ProjectDetail> = {
  "ecommerce-platform": {
    n: "01", title: "E-Commerce Platform", year: "2024",
    role: "Fullstack", status: "Live",
    tags: ["Next.js", "Node.js", "Stripe", "PostgreSQL", "Prisma", "Tailwind"],
    github: "https://github.com/aseppp", live: null,
    summary: "A production-grade e-commerce platform built for a retail client. Supports 10k+ SKUs, multi-variant products, real-time inventory, and a full admin dashboard — built in 6 weeks from scratch.",
    challenge: "The client had an existing Shopify store that was expensive, hard to customize, and couldn't support their specific multi-warehouse inventory logic. They needed ownership of the stack.",
    solution: "Built a custom Next.js storefront with App Router for SSR/SSG, a Node.js/Express backend with Prisma ORM, and Stripe for payments. The admin panel is a separate React SPA with role-based access.",
    outcome: "Reduced monthly platform cost by 80%. Checkout conversion rate improved by 12% after optimizing the funnel. Page load times under 1.2s for product pages.",
    stack: [
      { layer: "Frontend", tools: ["Next.js 14", "Tailwind CSS", "React Query", "Zustand"] },
      { layer: "Backend", tools: ["Node.js", "Express", "Prisma ORM", "PostgreSQL"] },
      { layer: "Payments", tools: ["Stripe", "Webhooks", "Stripe Elements"] },
      { layer: "Infra", tools: ["Vercel (frontend)", "Railway (backend)", "Cloudinary (images)"] },
    ],
    related: ["ops-dashboard", "blog-cms"],
  },
  "ops-dashboard": {
    n: "02", title: "Ops Dashboard", year: "2024",
    role: "Fullstack", status: "Live",
    tags: ["React", "Socket.io", "Redis", "TypeScript", "Chart.js", "Node.js"],
    github: "https://github.com/aseppp", live: null,
    summary: "Real-time operations dashboard for a logistics company — tracking vehicle locations, delivery statuses, and fleet performance metrics. Handles 50k+ requests per day with sub-100ms updates.",
    challenge: "The ops team was working with spreadsheets and delayed email reports. By the time they knew about a delivery issue, it was too late to intervene.",
    solution: "Built a WebSocket-powered dashboard with Socket.io, Redis pub/sub for message fanout, and Chart.js for live-updating metric charts. Role-based access for drivers, dispatchers, and managers.",
    outcome: "Mean response time to delivery issues dropped from 45 minutes to under 3 minutes. Zero downtime in 8 months of production.",
    stack: [
      { layer: "Frontend", tools: ["React", "TypeScript", "Chart.js", "Tailwind CSS"] },
      { layer: "Real-time", tools: ["Socket.io", "Redis Pub/Sub"] },
      { layer: "Backend", tools: ["Node.js", "Express", "PostgreSQL", "Prisma"] },
      { layer: "Auth", tools: ["JWT", "RBAC middleware"] },
    ],
    related: ["ecommerce-platform", "api-boilerplate"],
  },
  "api-boilerplate": {
    n: "03", title: "REST API Boilerplate", year: "2023",
    role: "Backend", status: "Open source",
    tags: ["Node.js", "Express", "Prisma", "Jest", "Zod", "JWT"],
    github: "https://github.com/aseppp", live: null,
    summary: "A production-ready Node.js API starter kit that I open-sourced after using a similar pattern across 5+ client projects. Skip the boilerplate, start with architecture.",
    challenge: "Every new project started with the same two weeks of setup: auth, validation, error handling, logging, rate limiting. Time that should be spent on product.",
    solution: "Codified my best patterns into a single, well-documented starter. Includes layered architecture (router → controller → service → repository), Zod validation, structured JSON logging with Pino, and a complete test suite template.",
    outcome: "Used as the starting point for 3 client projects. Estimated 12-15 hours saved per project in initial setup.",
    stack: [
      { layer: "Runtime", tools: ["Node.js", "Express"] },
      { layer: "Database", tools: ["PostgreSQL", "Prisma ORM"] },
      { layer: "Validation", tools: ["Zod"] },
      { layer: "Auth", tools: ["JWT", "bcryptjs"] },
      { layer: "Testing", tools: ["Jest", "Supertest"] },
      { layer: "Logging", tools: ["Pino", "pino-http"] },
    ],
    related: ["ops-dashboard", "ecommerce-platform"],
  },
  "blog-cms": {
    n: "04", title: "Blog CMS", year: "2023",
    role: "Frontend", status: "Live",
    tags: ["Next.js", "MDX", "Vercel", "Tailwind", "TypeScript"],
    github: "https://github.com/aseppp", live: null,
    summary: "A fast, minimal headless blog for a tech writer. MDX content, tag taxonomy, full-text search, reading time estimates, and an RSS feed. Loads under 800ms globally.",
    challenge: "The client wanted to write in Markdown with custom components, needed SEO out of the box, and didn't want to pay for a CMS subscription.",
    solution: "Next.js App Router with MDX processing via next-mdx-remote. Content lives in a /posts directory as .mdx files. ISR regenerates pages when content changes. Built-in search uses a client-side index.",
    outcome: "Core Web Vitals: LCP 0.8s, CLS 0, FID < 10ms. 95/100 Lighthouse performance score.",
    stack: [
      { layer: "Framework", tools: ["Next.js 14", "App Router", "ISR"] },
      { layer: "Content", tools: ["MDX", "next-mdx-remote", "gray-matter"] },
      { layer: "Styling", tools: ["Tailwind CSS", "Typography plugin"] },
      { layer: "Search", tools: ["Fuse.js (client-side)"] },
    ],
    related: ["portfolio", "ecommerce-platform"],
  },
  "task-manager": {
    n: "05", title: "Task Manager", year: "2023",
    role: "Fullstack", status: "Live",
    tags: ["React", "Redux", "Node.js", "Socket.io", "PostgreSQL"],
    github: "https://github.com/aseppp", live: null,
    summary: "A collaborative kanban board for small teams — drag-and-drop cards, real-time sync across users, notifications, and project-based workspaces.",
    challenge: "The team was using Trello but needed custom fields, time tracking, and tighter integration with their internal tools. SaaS options were either too expensive or too complex.",
    solution: "Custom kanban with React DnD, Socket.io for real-time sync (optimistic UI + server reconciliation), and a PostgreSQL backend with normalized board/column/card schema.",
    outcome: "Deployed for a 12-person team. Average task completion tracking improved by 40% in the first month.",
    stack: [
      { layer: "Frontend", tools: ["React", "Redux Toolkit", "React DnD", "Tailwind"] },
      { layer: "Real-time", tools: ["Socket.io", "Optimistic updates"] },
      { layer: "Backend", tools: ["Node.js", "Express", "PostgreSQL"] },
      { layer: "Auth", tools: ["JWT", "Refresh tokens"] },
    ],
    related: ["ops-dashboard", "api-boilerplate"],
  },
  "analytics-dashboard": {
    n: "06", title: "Analytics Dashboard", year: "2024",
    role: "Frontend", status: "WIP",
    tags: ["React", "Chart.js", "TypeScript", "Tailwind"],
    github: "https://github.com/aseppp", live: null,
    summary: "A data visualization dashboard for a logistics client — filterable time-series charts, KPI cards, date range pickers, and one-click CSV/PDF exports.",
    challenge: "The client had data scattered across 3 systems and was exporting to Excel weekly to build manual reports. Each report took 3-4 hours.",
    solution: "Built a dashboard that pulls from a single aggregated API endpoint. Chart.js for interactive visualizations, date-fns for range calculations, and jsPDF for on-demand PDF reports.",
    outcome: "Still in development — targeting 90% reduction in time spent on weekly reporting.",
    stack: [
      { layer: "Frontend", tools: ["React", "TypeScript", "Chart.js", "Tailwind"] },
      { layer: "Data", tools: ["REST API integration", "date-fns"] },
      { layer: "Export", tools: ["jsPDF", "PapaParse (CSV)"] },
    ],
    related: ["ops-dashboard", "task-manager"],
  },
  "portfolio": {
    n: "07", title: "This Portfolio", year: "2024",
    role: "Design + Dev", status: "Live",
    tags: ["Next.js", "GSAP", "TypeScript", "Tailwind"],
    github: "https://github.com/aseppp", live: "/",
    summary: "You're looking at it. Editorial typographic design, custom cursor with mix-blend-mode difference, multi-theme system with 9 themes, GSAP scroll animations, horizontal scroll projects, full-viewport hero, and a photos gallery.",
    challenge: "Every developer portfolio looks the same — hero photo, feature cards, project grid, contact form. I wanted something with a strong visual identity that felt personal.",
    solution: "Threw out the template. Built around a magazine editorial concept: oversized type as the UI, numbered sections, horizontal scroll, glass panels as the only decoration, and a cursor that inverts colors underneath it.",
    outcome: "You're here. I'd call that a success.",
    stack: [
      { layer: "Framework", tools: ["Next.js 14", "App Router"] },
      { layer: "Styling", tools: ["Tailwind CSS", "CSS variables", "Custom design system"] },
      { layer: "Animation", tools: ["GSAP", "ScrollTrigger"] },
      { layer: "Theme", tools: ["React context", "CSS custom properties", "9 themes"] },
    ],
    related: ["blog-cms", "ecommerce-platform"],
  },
};

export default function ProjectDetail() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const project = PROJECTS[slug];
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

  const related = (project.related ?? [])
    .map((s) => ({ slug: s, ...PROJECTS[s] }))
    .filter(Boolean);

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
