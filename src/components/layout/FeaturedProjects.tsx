"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { AiOutlineGithub } from "react-icons/ai";

gsap.registerPlugin(ScrollTrigger);

const featured = [
  {
    title: "E-Commerce Platform",
    description:
      "Full-stack e-commerce with product catalog, cart, Stripe checkout, order management, and admin dashboard. Built for scale.",
    tags: ["Next.js", "Node.js", "PostgreSQL", "Stripe"],
    github: "https://github.com/aseppp",
    live: null,
    color: "primary",
    emoji: "🛒",
  },
  {
    title: "Ops Dashboard",
    description:
      "Real-time logistics monitoring dashboard with WebSocket updates, chart visualizations, and role-based access control.",
    tags: ["React", "Socket.io", "Redis", "TypeScript"],
    github: "https://github.com/aseppp",
    live: null,
    color: "accent",
    emoji: "📊",
  },
  {
    title: "REST API Boilerplate",
    description:
      "Production-ready Node.js API starter with JWT auth, rate limiting, Prisma ORM, Swagger docs, and full test coverage.",
    tags: ["Node.js", "Express", "Prisma", "Jest"],
    github: "https://github.com/aseppp",
    live: null,
    color: "primary",
    emoji: "⚙️",
  },
];

export default function FeaturedProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headRef.current, {
        y: 40, opacity: 0, duration: 0.8, ease: "expo.out",
        scrollTrigger: { trigger: headRef.current, start: "top 88%" },
      });
      gsap.from(cardsRef.current?.children ?? [], {
        y: 50, opacity: 0, duration: 0.6, stagger: 0.12, ease: "expo.out",
        scrollTrigger: { trigger: cardsRef.current, start: "top 82%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 relative" aria-labelledby="projects-heading">
      <div className="section-divider mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div ref={headRef} className="flex items-end justify-between gap-6 mb-14 flex-wrap">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.2em] mb-4"
              style={{ color: "var(--color-primary)" }}
            >
              Portfolio
            </p>
            <h2
              id="projects-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
              style={{
                color: "var(--color-foreground)",
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.03em",
              }}
            >
              Featured work
            </h2>
          </div>
          <Link
            href="/project"
            className="group inline-flex items-center gap-2 text-sm font-semibold transition-colors"
            style={{ color: "var(--color-primary)" }}
          >
            View all projects
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {featured.map((p) => (
            <div
              key={p.title}
              className="group relative flex flex-col gap-5 p-6 rounded-2xl overflow-hidden"
              style={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                transition: "border-color 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "translateY(-6px)";
                el.style.borderColor = `color-mix(in srgb, var(--color-${p.color}) 40%, transparent)`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "translateY(0)";
                el.style.borderColor = "var(--color-border)";
              }}
            >
              {/* Glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in srgb, var(--color-${p.color}) 8%, transparent) 0%, transparent 100%)`,
                }}
                aria-hidden="true"
              />

              {/* Header */}
              <div className="flex items-start justify-between gap-2 relative z-10">
                <span className="text-3xl">{p.emoji}</span>
                <div className="flex gap-2">
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: "var(--color-mutedForeground)" }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLAnchorElement).style.color = "var(--color-foreground)")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLAnchorElement).style.color = "var(--color-mutedForeground)")
                      }
                      aria-label="GitHub repository"
                    >
                      <AiOutlineGithub size={18} />
                    </a>
                  )}
                  {p.live && (
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: "var(--color-mutedForeground)" }}
                      aria-label="Live demo"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 relative z-10">
                <h3
                  className="font-bold text-lg mb-2"
                  style={{ color: "var(--color-foreground)", fontFamily: "var(--font-display)" }}
                >
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-mutedForeground)" }}>
                  {p.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 relative z-10">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium px-2.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: "color-mix(in srgb, var(--color-foreground) 6%, transparent)",
                      color: "var(--color-mutedForeground)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
