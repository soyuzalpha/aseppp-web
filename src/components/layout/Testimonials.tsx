"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote:
      "Asep delivered a fully working e-commerce platform in 3 weeks. The code quality was excellent and he communicated every step of the way. Will definitely hire again.",
    author: "Rizky Pratama",
    role: "Founder, Tokobaju.id",
    avatar: "R",
    tag: "#E-Commerce",
  },
  {
    quote:
      "The real-time dashboard he built for our ops team transformed how we monitor our logistics. Clean UI, fast API, zero issues in production for 8 months.",
    author: "Sari Dewi",
    role: "Head of Operations, LogiTrack",
    avatar: "S",
    tag: "#Dashboard",
  },
  {
    quote:
      "Extremely reliable and detail-oriented. The REST API he architected handles 50k+ requests/day without breaking a sweat. Knows his stuff deeply.",
    author: "Budi Santoso",
    role: "CTO, FinPay Solutions",
    avatar: "B",
    tag: "#Backend API",
  },
  {
    quote:
      "Asep doesn't just write code — he thinks about product. He suggested improvements we hadn't thought of and the end result was far better than what we spec'd.",
    author: "Ayu Rahayu",
    role: "Product Lead, EduKita",
    avatar: "A",
    tag: "#SaaS",
  },
];

export default function Testimonials() {
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
        y: 48, opacity: 0, duration: 0.6, stagger: 0.12, ease: "expo.out",
        scrollTrigger: { trigger: cardsRef.current, start: "top 82%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 relative" aria-labelledby="testimonials-heading">
      <div className="section-divider mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div ref={headRef} className="text-center mb-16 max-w-xl mx-auto">
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em] mb-4"
            style={{ color: "var(--color-primary)" }}
          >
            Social proof
          </p>
          <h2
            id="testimonials-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold"
            style={{
              color: "var(--color-foreground)",
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.03em",
            }}
          >
            What clients say
          </h2>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="group relative flex flex-col gap-5 p-6 rounded-2xl overflow-hidden"
              style={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                transition: "border-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "color-mix(in srgb, var(--color-primary) 35%, transparent)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--color-border)";
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse 80% 50% at 50% 0%, color-mix(in srgb, var(--color-primary) 6%, transparent) 0%, transparent 100%)",
                }}
                aria-hidden="true"
              />

              {/* Tag + quote mark */}
              <div className="flex items-center justify-between relative z-10">
                <span
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                    color: "var(--color-primary)",
                  }}
                >
                  {t.tag}
                </span>
                <span
                  className="text-4xl leading-none font-serif select-none"
                  style={{ color: "var(--color-primary)", opacity: 0.3 }}
                  aria-hidden="true"
                >
                  "
                </span>
              </div>

              {/* Quote */}
              <p
                className="text-[15px] leading-relaxed flex-1 relative z-10"
                style={{ color: "var(--color-foreground)", opacity: 0.85 }}
              >
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 relative z-10">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                  style={{
                    background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                    color: "var(--color-primaryForeground)",
                  }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>
                    {t.author}
                  </p>
                  <p className="text-xs" style={{ color: "var(--color-mutedForeground)" }}>
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
