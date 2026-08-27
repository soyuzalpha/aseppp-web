"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { AiOutlineGithub, AiFillLinkedin, AiOutlineInstagram } from "react-icons/ai";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const SOCIALS = [
  { href: "https://github.com/aseppp",                icon: <AiOutlineGithub size={16} />, label: "GitHub" },
  { href: "https://linkedin.com/in/aseppp",           icon: <AiFillLinkedin size={16} />,  label: "LinkedIn" },
  { href: "https://instagram.com/aseppp.saepudin",    icon: <AiOutlineInstagram size={16} />, label: "Instagram" },
];

function LiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "Asia/Jakarta",
          hour: "2-digit", minute: "2-digit", second: "2-digit",
          hour12: false,
        })
      );
    fmt();
    const id = setInterval(fmt, 1000);
    return () => clearInterval(id);
  }, []);
  return <>{time} WIB</>;
}

export default function Hero() {
  const secRef   = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const botRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(contentRef.current?.children ?? [], {
        opacity: 0, y: 24, stagger: 0.1, duration: 0.9,
      }).from(botRef.current?.children ?? [], {
        opacity: 0, y: 10, stagger: 0.07, duration: 0.6,
      }, "-=0.5");

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
        backgroundColor: "var(--color-background)",
        overflow: "hidden",
      }}
    >
      {/* ── Grid background ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `
            linear-gradient(var(--color-border) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-border) 1px, transparent 1px)
          `,
          backgroundSize: "52px 52px",
          opacity: 0.5,
          maskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 20%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 20%, transparent 80%)",
        }}
      />

      {/* ── Centered content ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
            alignItems: "center",
            textAlign: "center",
            gap: "1.5rem",
            paddingBlock: "4rem",
          }}
        >
          {/* Status */}
          <span
            className="type-label"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              color: "var(--color-mutedForeground)",
            }}
          >
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              backgroundColor: "var(--color-accent)",
              display: "inline-block",
              animation: "cursor-blink 2s ease infinite",
            }} />
            Open to work · <LiveClock />
          </span>

          {/* Name */}
          <h1
            id="hero-name"
            style={{
              fontFamily: "var(--font-editorial)",
              fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.035em",
              color: "var(--color-foreground)",
            }}
          >
            Asep Saepudin
          </h1>

          {/* Role */}
          <p
            style={{
              fontFamily: "var(--font-outline)",
              fontSize: "clamp(1.2rem, 2.5vw, 2rem)",
              letterSpacing: "-0.02em",
              color: "transparent",
              WebkitTextStroke: "1px var(--color-foreground)",
              opacity: 0.5,
            }}
          >
            Fullstack Web Developer
          </p>

          {/* Tagline */}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.875rem, 1.2vw, 1rem)",
              lineHeight: 1.75,
              color: "var(--color-mutedForeground)",
              maxWidth: "42ch",
            }}
          >
            Building scalable web applications from Indonesia —
            clean backends, pixel-perfect frontends,
            things that ship and last.
          </p>

          {/* Divider */}
          <div style={{ width: "2rem", height: "1px", backgroundColor: "var(--color-border)" }} />

          {/* CTAs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
            <Link
              href="/project"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                padding: "0.65rem 1.5rem",
                backgroundColor: "var(--color-foreground)",
                color: "var(--color-background)",
                textDecoration: "none",
                fontFamily: "var(--font-body)",
                fontSize: "0.6875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 500,
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
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                padding: "0.65rem 1.5rem",
                backgroundColor: "transparent",
                color: "var(--color-mutedForeground)",
                textDecoration: "none",
                fontFamily: "var(--font-body)",
                fontSize: "0.6875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 500,
                border: "1px solid var(--color-border)",
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
          </div>

          {/* Socials */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginTop: "0.5rem" }}>
            {SOCIALS.map(({ href, icon, label }) => (
              <a
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
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--color-mutedForeground)")}
              >
                {icon}
              </a>
            ))}
            <span style={{ width: 1, height: 14, backgroundColor: "var(--color-border)", display: "inline-block" }} />
            <a
              href="mailto:asepp.saepudiin@gmail.com"
              className="type-label link-draw"
              style={{ color: "var(--color-mutedForeground)", textDecoration: "none" }}
            >
              asepp.saepudiin@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
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
        <span className="type-index">Bandung, Indonesia 🇮🇩</span>
        <span className="type-index">React · Next.js · Node.js · TypeScript</span>
        <span className="type-index">3+ yrs · 20+ projects</span>
      </div>
    </section>
  );
}
