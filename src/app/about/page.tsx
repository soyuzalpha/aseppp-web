"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "@/components/layout/Footer";
import SectionLabel from "@/components/ui/SectionLabel";

gsap.registerPlugin(ScrollTrigger);

/* Everything below is lifted from the CV (public/cv.pdf) — if a claim isn't
   in there, it doesn't belong on this page. */

const EXP = [
  {
    period: "12/2024 – Present",
    role: "Frontend Web Developer",
    co: "PT Data Integrasi Inovasi",
    points: [
      "Building EMR and SIMRS applications with the developer team",
      "Creating reusable, component-based UI",
      "Integrating API services",
    ],
  },
  {
    period: "10/2022 – 03/2023",
    role: "Frontend Web Developer",
    co: "Staff Pusat PT Ganesha Operation",
    points: [
      "Integrating superapp microservices with Next.js",
      "Building the Bimbel Online site and its responsive mobile layout",
    ],
  },
  {
    period: "09/2022 – 11/2022",
    role: "Frontend & Mobile Developer",
    co: "PT InArray Indonesia",
    points: [
      "Built a web warehouse management system in React JS",
      "Built the Reksadana mobile app with Ionic React",
    ],
  },
  {
    period: "2019 – 2021",
    role: "IT Field Support",
    co: "PT Primacom Interbuana",
    points: [
      "VSAT network installation, maintenance, and troubleshooting",
      "Monitoring network carriers to keep them healthy",
      "Working as a team on larger network architecture",
    ],
  },
];

const EDU = [
  { period: "01/2022 – 03/2022", degree: "Fullstack JavaScript Bootcamp", school: "Dumbways Indonesia" },
  { period: "2016 – 2019", degree: "Computer and Network Engineering", school: "SMK Pustek Serpong" },
];

const SKILLS: [string, string[]][] = [
  ["Frontend", ["HTML", "CSS", "JavaScript", "React JS", "React Native", "Next.js", "Tailwind CSS", "shadcn/ui", "Chakra UI", "Redux Toolkit"]],
  ["Backend", ["Node.js", "Express JS", "PostgreSQL", "MongoDB", "Prisma ORM"]],
  ["Mobile", ["React Native", "Ionic React"]],
  ["Tools", ["Git", "GitHub", "NextAuth", "Firebase", "Figma"]],
];

const CERTS = [
  { period: "2023", title: "JavaScript Basic", issuer: "HackerRank" },
  { period: "2022", title: "Belajar Dasar Pemrograman Web", issuer: "Dicoding Indonesia" },
  { period: "2021", title: "Bootcamp Fullstack JavaScript", issuer: "Dumbways Indonesia" },
  { period: "2021", title: "Responsive Web Design", issuer: "freeCodeCamp" },
];

const LANG = [
  { name: "Bahasa Indonesia", level: "Native" },
  { name: "English", level: "Beginner" },
];

/* Education rows are single-line, so they keep the 3-column form. */
const ROW_SPLIT = {
  ["--split-a" as string]: "clamp(8rem, 16vw, 13rem)",
  ["--split-b" as string]: "clamp(6rem, 12vw, 10rem)",
  ["--split-gap" as string]: "2rem",
  paddingBlock: "1.25rem",
  borderBottom: "1px solid var(--color-border)",
};

/* Experience rows carry bullets, so they get two columns — the bullets take
   the full width next to the dates instead of a cramped third column. */
const EXP_SPLIT = {
  ["--split-a" as string]: "clamp(7rem, 14vw, 11rem)",
  ["--split-gap" as string]: "2rem",
  paddingBlock: "1.25rem",
  borderBottom: "1px solid var(--color-border)",
};

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
          <p className="type-index reveal" style={{ marginTop: "0.75rem" }}>
            Frontend Developer · Serpong, Tangerang Selatan
          </p>
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
              Frontend developer with 2+ years building responsive, interactive, and user-friendly web and mobile
              applications — the frontend of an EMR/SIMRS system today, superapps and online learning platforms before
              that.
            </p>
            <p className="type-body" style={{ color: "var(--color-mutedForeground)", maxWidth: "54ch" }}>
              I work mostly in the React and Node.js ecosystem: React, React Native, and Next.js on the front, Express
              with PostgreSQL or MongoDB and Prisma behind it. Currently open to new projects and full-time roles.
            </p>
            <div style={{ marginTop: "2rem" }}>
              <a
                href="/cv.pdf"
                download="CV Asep Saepudin 2025.pdf"
                className="type-label link-draw"
                style={{ color: "var(--color-foreground)", textDecoration: "none" }}
              >
                Download CV →
              </a>
            </div>
          </div>
        </div>

        {/* ── Skills ── */}
        <div className="col" style={{ paddingBlock: "3.5rem", borderBottom: "1px solid var(--color-border)" }}>
          <p className="type-label mb-8 reveal">
            <span style={{ color: "var(--color-accentText)", marginRight: "0.5em" }}>Skills</span>
          </p>
          <div
            className="grid gap-px reveal"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 22rem), 1fr))",
              border: "1px solid var(--color-border)",
            }}
          >
            {SKILLS.map(([layer, tools]) => (
              <div
                key={layer}
                style={{
                  padding: "1.75rem",
                  borderRight: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-card)",
                }}
              >
                <p className="type-index mb-3" style={{ color: "var(--color-accentText)" }}>
                  {layer}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {tools.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Experience ── */}
        <div className="col" style={{ paddingBlock: "3.5rem", borderBottom: "1px solid var(--color-border)" }}>
          <p className="type-label mb-8 reveal">
            <span style={{ color: "var(--color-accentText)", marginRight: "0.5em" }}>Experience</span>
          </p>
          {EXP.map((e) => (
            <div key={e.role + e.co} className="reveal split" style={EXP_SPLIT}>
              <span className="type-index">{e.period}</span>
              <span>
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-medium)",
                    fontSize: "clamp(0.95rem, 1.3vw, 1.05rem)",
                    color: "var(--color-foreground)",
                  }}
                >
                  {e.role}
                </span>
                <span className="type-index" style={{ display: "block", marginTop: "0.35rem", marginBottom: "0.75rem" }}>
                  {e.co}
                </span>
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {e.points.map((pt) => (
                    <li
                      key={pt}
                      className="type-body"
                      style={{
                        color: "var(--color-mutedForeground)",
                        fontSize: "0.8125rem",
                        lineHeight: 1.55,
                        marginBottom: "0.35rem",
                      }}
                    >
                      — {pt}
                    </li>
                  ))}
                </ul>
              </span>
            </div>
          ))}
        </div>

        {/* ── Education ── */}
        <div className="col" style={{ paddingBlock: "3.5rem", borderBottom: "1px solid var(--color-border)" }}>
          <p className="type-label mb-8 reveal">
            <span style={{ color: "var(--color-accentText)", marginRight: "0.5em" }}>Education</span>
          </p>
          {EDU.map((e) => (
            <div key={e.degree} className="reveal split-3" style={ROW_SPLIT}>
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

        {/* ── Certificates + languages ── */}
        <div
          className="col split"
          style={{
            paddingBlock: "3.5rem",
            ["--split-a" as string]: "clamp(14rem, 34vw, 26rem)",
            ["--split-gap" as string]: "3rem",
          }}
        >
          <div>
            <p className="type-label mb-8 reveal">
              <span style={{ color: "var(--color-accentText)", marginRight: "0.5em" }}>Certificates</span>
            </p>
            {CERTS.map((c) => (
              <div
                key={c.title}
                className="reveal"
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "1rem",
                  paddingBlock: "0.75rem",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <span className="type-index" style={{ flexShrink: 0 }}>{c.period}</span>
                <span style={{ flex: 1, fontSize: "0.875rem", color: "var(--color-foreground)" }}>{c.title}</span>
                <span className="type-index" style={{ flexShrink: 0, textAlign: "right" }}>{c.issuer}</span>
              </div>
            ))}
          </div>

          <div>
            <p className="type-label mb-8 reveal">
              <span style={{ color: "var(--color-accentText)", marginRight: "0.5em" }}>Languages</span>
            </p>
            {LANG.map((l) => (
              <div
                key={l.name}
                className="reveal"
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: "1rem",
                  paddingBlock: "0.75rem",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <span style={{ fontSize: "0.875rem", color: "var(--color-foreground)" }}>{l.name}</span>
                <span className="type-index">{l.level}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
