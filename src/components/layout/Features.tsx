"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: "⚡",
    title: "Blazing Fast APIs",
    desc: "Production-grade REST & GraphQL APIs on Node.js with sub-100ms response times, proper caching, rate limiting and auth.",
    accent: "primary",
    tag: "Backend",
  },
  {
    icon: "🎨",
    title: "Pixel-Perfect UI",
    desc: "Responsive, accessible interfaces with Next.js, Tailwind, and GSAP animations — from wireframe to shipped in record time.",
    accent: "accent",
    tag: "Frontend",
  },
  {
    icon: "🗄️",
    title: "Robust Data Layers",
    desc: "PostgreSQL, MongoDB, Prisma ORM — modeled for performance, integrity, and growth. Complex queries? No problem.",
    accent: "primary",
    tag: "Database",
  },
  {
    icon: "🔐",
    title: "Auth & Security",
    desc: "JWT, OAuth2, session management, RBAC — security built-in from day one, not bolted on at the end.",
    accent: "accent",
    tag: "Security",
  },
  {
    icon: "☁️",
    title: "Cloud & DevOps",
    desc: "CI/CD pipelines, Docker containers, AWS deployments. Your app goes from code to production automatically and reliably.",
    accent: "primary",
    tag: "Infrastructure",
  },
  {
    icon: "🔁",
    title: "Real-time Systems",
    desc: "WebSocket, Server-Sent Events, live dashboards. When milliseconds matter, I build for them.",
    accent: "accent",
    tag: "Real-time",
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headRef.current, {
        y: 40, opacity: 0, duration: 0.8, ease: "expo.out",
        scrollTrigger: { trigger: headRef.current, start: "top 88%" },
      });
      gsap.from(gridRef.current?.children ?? [], {
        y: 48, opacity: 0, duration: 0.6, stagger: 0.1, ease: "expo.out",
        scrollTrigger: { trigger: gridRef.current, start: "top 82%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 relative" aria-labelledby="features-heading">
      {/* Section divider top */}
      <div className="section-divider mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div ref={headRef} className="text-center mb-16 max-w-2xl mx-auto">
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em] mb-4"
            style={{ color: "var(--color-primary)" }}
          >
            What I do
          </p>
          <h2
            id="features-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
            style={{
              color: "var(--color-foreground)",
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.03em",
            }}
          >
            Every layer of the{" "}
            <span className="gradient-text">web stack</span>
          </h2>
          <p className="mt-4 text-base" style={{ color: "var(--color-mutedForeground)" }}>
            From the database to the browser — I cover it all, and I care about every layer.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative flex flex-col gap-4 p-6 rounded-2xl cursor-default overflow-hidden"
              style={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                transition: "border-color 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = "translateY(-6px)";
                el.style.borderColor = `color-mix(in srgb, var(--color-${f.accent}) 40%, transparent)`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = "translateY(0)";
                el.style.borderColor = "var(--color-border)";
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse 60% 50% at 50% 0%, color-mix(in srgb, var(--color-${f.accent}) 8%, transparent) 0%, transparent 100%)`,
                }}
                aria-hidden="true"
              />

              {/* Icon + tag */}
              <div className="flex items-center justify-between">
                <span className="text-3xl">{f.icon}</span>
                <span
                  className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: `color-mix(in srgb, var(--color-${f.accent}) 12%, transparent)`,
                    color: `var(--color-${f.accent})`,
                  }}
                >
                  {f.tag}
                </span>
              </div>

              {/* Text */}
              <div>
                <h3
                  className="font-bold text-lg mb-2"
                  style={{ color: "var(--color-foreground)", fontFamily: "var(--font-display)" }}
                >
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-mutedForeground)" }}>
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
