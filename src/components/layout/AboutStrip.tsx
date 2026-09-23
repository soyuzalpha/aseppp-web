"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import SectionLabel from "@/components/ui/SectionLabel";

gsap.registerPlugin(ScrollTrigger);

/* From the CV (public/cv.pdf) — same source as the About page. */
const FACTS = [
  { label: "Location", value: "Serpong, Tangerang Selatan" },
  { label: "Experience", value: "2+ years" },
  { label: "Focus", value: "Frontend Web" },
  { label: "Languages", value: "ID / EN" },
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
    <section ref={ref} aria-labelledby="about-label" className="section">
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
        className="col split pt-10"
        style={{
          ["--split-a" as string]: "clamp(12rem, 25vw, 20rem)",
          ["--split-gap" as string]: "4rem",
        }}
      >
        {/* Photo */}
        <div
          className="about-item"
          style={{
            width: "100%",
            maxWidth: "20rem",
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
            Frontend developer from Serpong, Indonesia — 2+ years building responsive, interactive, and user-friendly
            web and mobile applications. I care about the details other developers skip.
          </p>

          <p
            className="type-body mt-4"
            style={{
              color: "var(--color-mutedForeground)",
              maxWidth: "52ch",
            }}
          >
            Mostly the React and Node.js ecosystem: React, React Native, and Next.js on the front, Express with
            PostgreSQL or MongoDB and Prisma behind it. Currently open to new projects and full-time roles.
          </p>
        </div>
      </div>

      {/* ── Row 3 — facts strip ── */}
      <div className="col mt-10">
        <div className="facts">
          {FACTS.map(({ label, value }) => (
            <div key={label} className="about-item">
              <p className="type-label mb-1" style={{ fontSize: "0.625rem" }}>
                {label}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(0.8125rem, 1.2vw, 0.9375rem)",
                  color: "var(--color-foreground)",
                }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
