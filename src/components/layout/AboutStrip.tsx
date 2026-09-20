"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import SectionLabel from "@/components/ui/SectionLabel";

gsap.registerPlugin(ScrollTrigger);

const FACTS = [
  { label: "Age", value: "26" },
  { label: "Location", value: "Bandung, ID" },
  { label: "Experience", value: "3+ years" },
  { label: "Focus", value: "Fullstack Web" },
  { label: "Status", value: "Open to work" },
];

export default function AboutStrip() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current?.querySelectorAll(".about-item") ?? [], {
        opacity: 0,
        y: 20,
        stagger: 0.06,
        duration: 0.7,
        ease: "expo.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} aria-labelledby="about-label" style={{ paddingBlock: "5rem" }}>
      {/* ── Row 1 — label + number ── */}
      <div
        className="col flex items-baseline justify-between pb-5"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <span id="about-label">
          <SectionLabel n="01">About</SectionLabel>
        </span>
        <span className="type-index">asep saepudin</span>
      </div>

      {/* ── Row 2 — profile + body ── */}
      <div
        className="col grid gap-10 pt-10"
        style={{
          gridTemplateColumns: "clamp(12rem, 25vw, 20rem) 1fr",
          gap: "4rem",
        }}
      >
        {/* Photo */}
        <div
          className="about-item"
          style={{
            width: "100%",
            aspectRatio: "1",
            overflow: "hidden",
            borderRadius: "4px",
          }}
        >
          <Image
            src="/profile_picture.png"
            alt="Asep Saepudin"
            width={500}
            height={500}
            className="w-full h-full"
            style={{
              objectFit: "cover",
              objectPosition: "top",
              filter: "grayscale(20%)",
            }}
          />
        </div>

        {/* Text body */}
        <div className="about-item">
          <p
            className="type-body"
            style={{
              color: "var(--color-foreground)",
              maxWidth: "52ch",
            }}
          >
            I&apos;m a fullstack developer from Indonesia with a <em>serious</em> approach to craft. I believe the web
            should be fast, accessible, and purposefully designed, and I build it that way.
          </p>

          <p
            className="type-body mt-4"
            style={{
              color: "var(--color-mutedForeground)",
              maxWidth: "52ch",
            }}
          >
            When I&apos;m not coding I&apos;m thinking about design systems, reading about architecture patterns, or
            taking a long walk with a strong coffee.
          </p>
        </div>
      </div>

      {/* ── Row 3 — facts strip ── */}
      <div
        className="col mt-10 grid"
        style={{
          gridTemplateColumns: `repeat(${FACTS.length}, 1fr)`,
          borderTop: "1px solid var(--color-border)",
        }}
      >
        {FACTS.map(({ label, value }, i) => (
          <div
            key={label}
            className="about-item py-5"
            style={{
              borderRight: i < FACTS.length - 1 ? "1px solid var(--color-border)" : "none",
              paddingInline: i === 0 ? "0 1.5rem" : "1.5rem",
              // background: "color-mix(in srgb, var(--color-card) 60%, transparent)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <p className="type-index mb-1">{label}</p>
            <p
              style={{
                fontFamily: "var(--font-medium)",
                fontSize: "clamp(0.9rem, 1.4vw, 1.1rem)",
                color: "var(--color-foreground)",
                letterSpacing: "-0.01em",
              }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
