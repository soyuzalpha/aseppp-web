"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "@/components/layout/Footer";
import SectionLabel from "@/components/ui/SectionLabel";

gsap.registerPlugin(ScrollTrigger);

const EXP = [
  { period: "2023 – Present", role: "Fullstack Developer", co: "Freelance / Remote" },
  { period: "2022 – 2023", role: "Frontend Developer", co: "Tech Agency" },
  { period: "2020 – 2022", role: "Web Dev Intern", co: "Startup" },
];

const EDU = [{ period: "2017 – 2021", degree: "S1 Informatics", school: "University" }];

const VALUES = [
  ["Craft over shortcuts", "I care about the details other developers skip."],
  ["Ship, then improve", "Momentum beats perfection. Iterate in public."],
  ["Read the spec", "Accessibility, performance, and security are not optional."],
  ["Design-aware", "Good code and good design solve the same problem."],
];

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<Element>(".reveal").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 24,
          duration: 0.7,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef}>
      <main style={{ paddingTop: "5rem" }}>
        {/* ── Page title ── */}
        <div
          className="col"
          style={{
            paddingTop: "3rem",
            paddingBottom: "2rem",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <p className="mb-3">
            <SectionLabel n="01">About</SectionLabel>
          </p>
          <h1 className="type-title reveal" style={{ color: "var(--color-foreground)" }}>
            Asep Saepudin
          </h1>
        </div>

        {/* ── Intro block ── */}
        <div
          className="col reveal split"
          style={{
            paddingBlock: "3.5rem",
            borderBottom: "1px solid var(--color-border)",
            ["--split-a" as string]: "clamp(7rem, 15vw, 11rem)",
            ["--split-gap" as string]: "3rem",
          }}
        >
          <div style={{ aspectRatio: "1", overflow: "hidden" }}>
            <Image
              src="/profile_picture.png"
              alt="Asep Saepudin"
              width={400}
              height={400}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
            />
          </div>
          <div>
            <p
              className="type-body"
              style={{ color: "var(--color-foreground)", maxWidth: "54ch", marginBottom: "1.25rem" }}
            >
              I&apos;m a fullstack developer from Bandung, Indonesia. I care deeply about the work — not just shipping
              things, but shipping things right. That means clean architecture, thoughtful APIs, accessible interfaces,
              and code that future-me won&apos;t curse.
            </p>
            <p className="type-body" style={{ color: "var(--color-mutedForeground)", maxWidth: "54ch" }}>
              I specialize in the Node.js + React ecosystem but I&apos;m not religious about tools — I use what makes
              the product better. Currently open to new projects and full-time roles.
            </p>
            <div style={{ marginTop: "2rem" }}>
              <a
                href="https://drive.google.com/file/d/1ChStsEIjCPXg0NclewSZb4qry90uRLnB/view"
                target="_blank"
                rel="noopener noreferrer"
                className="type-label link-draw"
                style={{ color: "var(--color-foreground)", textDecoration: "none" }}
              >
                Download CV →
              </a>
            </div>
          </div>
        </div>

        {/* ── Values ── */}
        <div className="col" style={{ paddingBlock: "3.5rem", borderBottom: "1px solid var(--color-border)" }}>
          <p className="type-label mb-8 reveal">
            <span style={{ color: "var(--color-accent)", marginRight: "0.5em" }}>Values</span>
          </p>
          <div
            className="grid gap-px reveal"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 22rem), 1fr))",
              border: "1px solid var(--color-border)",
            }}
          >
            {VALUES.map(([title, desc]) => (
              <div
                key={title}
                style={{
                  padding: "1.75rem",
                  borderRight: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-card)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-medium)",
                    fontSize: "1rem",
                    color: "var(--color-foreground)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {title}
                </p>
                <p className="type-body" style={{ color: "var(--color-mutedForeground)", fontSize: "0.875rem" }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Experience ── */}
        <div className="col" style={{ paddingBlock: "3.5rem", borderBottom: "1px solid var(--color-border)" }}>
          <p className="type-label mb-8 reveal">
            <span style={{ color: "var(--color-accent)", marginRight: "0.5em" }}>Experience</span>
          </p>
          {EXP.map((e, i) => (
            <div
              key={i}
              className="reveal split-3"
              style={{
                ["--split-a" as string]: "clamp(8rem, 16vw, 13rem)",
                ["--split-b" as string]: "clamp(6rem, 12vw, 10rem)",
                ["--split-gap" as string]: "2rem",
                paddingBlock: "1.25rem",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <span className="type-index">{e.period}</span>
              <span
                style={{
                  fontFamily: "var(--font-medium)",
                  fontSize: "clamp(0.95rem, 1.3vw, 1.05rem)",
                  color: "var(--color-foreground)",
                }}
              >
                {e.role}
              </span>
              <span className="type-index" style={{ textAlign: "right" }}>
                {e.co}
              </span>
            </div>
          ))}
        </div>

        {/* ── Education ── */}
        <div className="col" style={{ paddingBlock: "3.5rem" }}>
          <p className="type-label mb-8 reveal">
            <span style={{ color: "var(--color-accent)", marginRight: "0.5em" }}>Education</span>
          </p>
          {EDU.map((e, i) => (
            <div
              key={i}
              className="reveal split-3"
              style={{
                ["--split-a" as string]: "clamp(8rem, 16vw, 13rem)",
                ["--split-b" as string]: "clamp(6rem, 12vw, 10rem)",
                ["--split-gap" as string]: "2rem",
                paddingBlock: "1.25rem",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <span className="type-index">{e.period}</span>
              <span style={{ fontFamily: "var(--font-medium)", fontSize: "1rem", color: "var(--color-foreground)" }}>
                {e.degree}
              </span>
              <span className="type-index" style={{ textAlign: "right" }}>
                {e.school}
              </span>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
