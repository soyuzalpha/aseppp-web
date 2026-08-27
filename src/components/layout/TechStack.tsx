"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stack = [
  { name: "React", logo: "/logo/react.png", category: "Frontend", level: "Expert" },
  { name: "Next.js", logo: "/logo/nextjs.png", category: "Framework", level: "Expert" },
  { name: "Node.js", logo: "/logo/nodejs.png", category: "Backend", level: "Expert" },
  { name: "TypeScript", logo: "/logo/js.png", category: "Language", level: "Advanced" },
  { name: "Tailwind", logo: "/logo/tailwind.png", category: "Styling", level: "Expert" },
  { name: "Redux", logo: "/logo/redux.png", category: "State", level: "Advanced" },
  { name: "Chakra UI", logo: "/logo/chakra.png", category: "UI Lib", level: "Advanced" },
  { name: "Git", logo: "/logo/git.png", category: "DevOps", level: "Expert" },
  { name: "GitHub", logo: "/logo/github.png", category: "DevOps", level: "Expert" },
  { name: "GitLab", logo: "/logo/gitlab.png", category: "DevOps", level: "Proficient" },
];

const levelColor: Record<string, string> = {
  Expert: "primary",
  Advanced: "accent",
  Proficient: "mutedForeground",
};

export default function TechStack() {
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
        y: 36, opacity: 0, duration: 0.5, stagger: 0.06, ease: "expo.out",
        scrollTrigger: { trigger: gridRef.current, start: "top 82%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 relative" aria-labelledby="techstack-heading">
      <div className="section-divider mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div ref={headRef} className="text-center mb-14 max-w-xl mx-auto">
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em] mb-4"
            style={{ color: "var(--color-primary)" }}
          >
            Skills &amp; Tools
          </p>
          <h2
            id="techstack-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
            style={{
              color: "var(--color-foreground)",
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.03em",
            }}
          >
            My tech stack
          </h2>
          <p className="mt-4 text-base" style={{ color: "var(--color-mutedForeground)" }}>
            Tools I use to build fast, reliable, and beautiful web applications.
          </p>
        </div>

        {/* Cards */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
        >
          {stack.map((tech) => (
            <div
              key={tech.name}
              className="group relative flex flex-col items-center gap-3 p-5 rounded-2xl cursor-default overflow-hidden"
              style={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                transition: "border-color 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "translateY(-5px) scale(1.02)";
                el.style.borderColor = `color-mix(in srgb, var(--color-primary) 40%, transparent)`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "translateY(0) scale(1)";
                el.style.borderColor = "var(--color-border)";
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{
                  background: "radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--color-primary) 10%, transparent) 0%, transparent 70%)",
                }}
                aria-hidden="true"
              />

              {/* Category badge */}
              <span
                className="absolute top-2.5 right-2.5 text-[9px] font-semibold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--color-primary) 12%, transparent)",
                  color: "var(--color-primary)",
                }}
              >
                {tech.category}
              </span>

              {/* Logo */}
              <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-110 z-10">
                <Image src={tech.logo} alt={tech.name} fill className="object-contain" sizes="48px" />
              </div>

              {/* Name */}
              <p className="text-sm font-semibold text-center z-10" style={{ color: "var(--color-foreground)" }}>
                {tech.name}
              </p>

              {/* Level dot */}
              <span
                className="text-[10px] font-medium z-10"
                style={{ color: `var(--color-${levelColor[tech.level]})` }}
              >
                {tech.level}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
