"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { AiOutlineGithub, AiFillLinkedin, AiOutlineInstagram } from "react-icons/ai";
import Link from "next/link";
import SectionLabel from "@/components/ui/SectionLabel";

gsap.registerPlugin(ScrollTrigger);

const SOCIALS = [
  { href: "https://github.com/soyuzalpha", icon: <AiOutlineGithub size={16} />, label: "GitHub" },
  { href: "https://linkedin.com/in/aseppp", icon: <AiFillLinkedin size={16} />, label: "LinkedIn" },
  { href: "https://instagram.com/soyuz.beta", icon: <AiOutlineInstagram size={16} />, label: "Instagram" },
];

const FACTS = [
  { label: "ROLE", value: "Fullstack Web Developer" },
  { label: "BASE", value: "Bandung, Indonesia" },
  { label: "STACK", value: "React · Next.js · Node · TS" },
  { label: "STATUS", value: "Open to work" },
];

function LiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "Asia/Jakarta",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      );
    fmt();
    const id = setInterval(fmt, 1000);
    return () => clearInterval(id);
  }, []);
  return <>{time} WIB</>;
}

export default function Hero() {
  const secRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(contentRef.current?.children ?? [], {
        opacity: 0,
        y: 24,
        stagger: 0.1,
        duration: 0.9,
      }).from(
        botRef.current?.children ?? [],
        {
          opacity: 0,
          y: 10,
          stagger: 0.07,
          duration: 0.6,
        },
        "-=0.5",
      );

      ScrollTrigger.create({
        trigger: secRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 2,
        onUpdate: (self) => {
          if (contentRef.current)
            gsap.set(contentRef.current, { y: self.progress * -40, opacity: 1 - self.progress * 2 });
        },
      });
    }, secRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={secRef}
      aria-labelledby="hero-name"
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        paddingTop: "3.5rem",
        overflow: "hidden",
      }}
    >
      {/* ── Halftone dot accent (CSS only) ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "14%",
          right: "-6%",
          width: "clamp(16rem, 34vw, 30rem)",
          aspectRatio: "1",
          borderRadius: "50%",
          backgroundImage: "radial-gradient(var(--color-foreground) 1.2px, transparent 1.2px)",
          backgroundSize: "8px 8px",
          maskImage: "radial-gradient(circle at 35% 35%, black 0%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(circle at 35% 35%, black 0%, transparent 72%)",
          opacity: 0.9,
          pointerEvents: "none",
        }}
      />

      {/* ── Content ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          ref={contentRef}
          className="col"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "1.75rem",
            paddingBlock: "4rem",
            width: "100%",
          }}
        >
          {/* Label row */}
          <SectionLabel n="01">FULLSTACK DEVELOPER · BANDUNG, ID</SectionLabel>

          {/* Name */}
          <h1
            id="hero-name"
            className="type-display"
            style={{ color: "var(--color-foreground)" }}
          >
            ASEP SAEPUDIN<span style={{ color: "var(--color-accent)" }}>.</span>
          </h1>

          {/* Tagline */}
          <p
            className="type-body"
            style={{ color: "var(--color-mutedForeground)", maxWidth: "52ch" }}
          >
            I build scalable web applications — clean backends, pixel-perfect frontends, things that ship and last.
          </p>

          {/* Fact cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(11rem, 1fr))",
              gap: "1px",
              width: "100%",
              maxWidth: "46rem",
              backgroundColor: "var(--color-border)",
              border: "1px solid var(--color-border)",
              borderRadius: "2px",
            }}
          >
            {FACTS.map(({ label, value }) => (
              <div
                key={label}
                style={{
                  backgroundColor: "var(--color-card)",
                  padding: "0.9rem 1.1rem",
                }}
              >
                <p className="type-label" style={{ fontSize: "0.625rem", marginBottom: "0.35rem" }}>
                  {label}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8125rem",
                    color: "var(--color-foreground)",
                  }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* CTAs + socials */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1.5rem" }}>
            <Link
              href="/project"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.65rem 1.4rem",
                backgroundColor: "var(--color-foreground)",
                color: "var(--color-background)",
                textDecoration: "none",
                fontFamily: "var(--font-mono)",
                fontSize: "0.6875rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                borderRadius: "2px",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.8")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
            >
              View work <ArrowUpRight size={11} strokeWidth={2} />
            </Link>
            <Link
              href="/about"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.65rem 1.4rem",
                backgroundColor: "transparent",
                color: "var(--color-mutedForeground)",
                textDecoration: "none",
                fontFamily: "var(--font-mono)",
                fontSize: "0.6875rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                border: "1px solid var(--color-border)",
                borderRadius: "2px",
                transition: "color 0.2s ease, border-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.color = "var(--color-foreground)";
                el.style.borderColor = "var(--color-foreground)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.color = "var(--color-mutedForeground)";
                el.style.borderColor = "var(--color-border)";
              }}
            >
              About me
            </Link>

            <span style={{ display: "inline-flex", alignItems: "center", gap: "1rem", marginLeft: "0.25rem" }}>
              {SOCIALS.map(({ href, icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    color: "var(--color-mutedForeground)",
                    textDecoration: "none",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--color-foreground)")}
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color = "var(--color-mutedForeground)")
                  }
                >
                  {icon}
                </Link>
              ))}
            </span>
          </div>
        </div>
      </div>

      {/* ── Status bar ── */}
      <div
        ref={botRef}
        className="col"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          paddingBlock: "0.875rem",
          borderTop: "1px solid var(--color-border)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <span className="type-index">
          <span
            style={{
              display: "inline-block",
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "var(--color-accent)",
              marginRight: "0.5em",
              animation: "cursor-blink 2s ease infinite",
            }}
          />
          Open to work · <LiveClock />
        </span>
        <span className="type-index">3+ yrs · 20+ projects</span>
        <span className="type-index">TSX · UTF-8 · Ln 14, Col 1</span>
      </div>
    </section>
  );
}
