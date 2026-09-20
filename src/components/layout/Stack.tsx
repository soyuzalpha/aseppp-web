"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionLabel from "@/components/ui/SectionLabel";

gsap.registerPlugin(ScrollTrigger);

const STACK = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "GSAP", "Framer Motion", "Chakra UI"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express", "NestJS", "GraphQL", "REST", "WebSocket", "Redis"],
  },
  {
    category: "Data",
    items: ["PostgreSQL", "MongoDB", "Prisma", "MySQL", "Drizzle ORM"],
  },
  {
    category: "Infra & Tools",
    items: ["Git", "Docker", "GitHub Actions", "Vercel", "AWS", "Nginx", "Linux"],
  },
  {
    category: "Workflow",
    items: ["VS Code", "Figma", "Postman", "Jira", "Notion", "Zod", "Jest"],
  },
];

export default function Stack() {
  const secRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(secRef.current?.querySelectorAll(".stack-row") ?? [], {
        opacity: 0,
        y: 16,
        stagger: 0.05,
        duration: 0.6,
        ease: "expo.out",
        scrollTrigger: { trigger: secRef.current, start: "top 85%" },
      });
    }, secRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={secRef} aria-labelledby="stack-label" className="section">
      {/* Header row */}
      <div
        className="col flex items-baseline justify-between pb-5"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <span id="stack-label">
          <SectionLabel n="03">Stack</SectionLabel>
        </span>
        <span className="type-index">{STACK.reduce((s, c) => s + c.items.length, 0)} tools</span>
      </div>

      {/* Stack table */}
      <div className="col">
        {STACK.map(({ category, items }) => (
          <div
            key={category}
            className="stack-row split py-5"
            style={{
              borderBottom: "1px solid var(--color-border)",
              ["--split-a" as string]: "clamp(7rem, 14vw, 11rem)",
              ["--split-gap" as string]: "2rem",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.background =
                "color-mix(in srgb, var(--color-card) 55%, transparent)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = "transparent";
            }}
          >
            <span
              className="type-label"
              style={{ paddingTop: "0.2rem", color: "var(--color-mutedForeground)" }}
            >
              {category}
            </span>

            <div className="flex flex-wrap gap-x-5 gap-y-1">
              {items.map((item, i) => (
                <span
                  key={item}
                  style={{
                    fontFamily: "var(--font-medium)",
                    fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)",
                    color: "var(--color-foreground)",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.8,
                  }}
                >
                  {item}
                  {i < items.length - 1 && (
                    <span style={{ color: "var(--color-border)", marginLeft: "0.4em", userSelect: "none" }}>
                      /
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
