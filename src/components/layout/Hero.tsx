"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { AiOutlineGithub, AiFillLinkedin, AiOutlineInstagram } from "react-icons/ai";
import Link from "next/link";
import LightRays from "./LightRays";
import { useTheme } from "@/context/ThemeContext";

gsap.registerPlugin(ScrollTrigger);

const SOCIALS = [
  { href: "https://github.com/soyuzalpha", icon: <AiOutlineGithub size={16} />, label: "GitHub" },
  { href: "https://linkedin.com/in/aseppp", icon: <AiFillLinkedin size={16} />, label: "LinkedIn" },
  { href: "https://instagram.com/soyuz.beta", icon: <AiOutlineInstagram size={16} />, label: "Instagram" },
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
  const { theme, mode } = useTheme();
  const secRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);
  const [accentColor, setAccentColor] = useState("#ffffff");

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

  useEffect(() => {
    const color = getComputedStyle(document.documentElement).getPropertyValue("--color-accent").trim();

    if (color) {
      setAccentColor(color);
    }
  }, [theme, mode]);

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
      {/* ── Background ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          // pointerEvents: "none",
          // backgroundImage: `
          //   linear-gradient(var(--color-border) 1px, transparent 1px),
          //   linear-gradient(90deg, var(--color-border) 1px, transparent 1px)
          // `,
          // backgroundSize: "52px 52px",
          // opacity: 0.5,
          maskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 20%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 20%, transparent 80%)",
        }}
      >
        <LightRays
          raysOrigin="top-center"
          // raysColor="#ffffff"
          raysColor={accentColor}
          raysSpeed={1}
          lightSpread={0.5}
          rayLength={3}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
          className="custom-rays"
          pulsating={false}
          fadeDistance={1}
          saturation={1}
        />
      </div>

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
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--color-mutedForeground)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "var(--color-accent)",
                display: "inline-block",
                animation: "cursor-blink 2s ease infinite",
              }}
            />
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
            Building scalable web applications from Indonesia — clean backends, pixel-perfect frontends, things that
            ship and last.
          </p>

          {/* Divider */}
          <div style={{ width: "2rem", height: "1px", backgroundColor: "var(--color-border)" }} />

          {/* CTAs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
            <Link
              href="/project"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
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
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
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

/**
 * ── Design concept ──────────────────────────────────────────────
 * Instead of a centered "name + tagline + buttons" stack (the template
 * every dev portfolio ships with), the hero is staged as a real code
 * editor: window chrome, tabs, a gutter with line numbers, and Asep's
 * bio written *as the code itself* — a `developer` object that gets
 * exported. Socials become an import statement (icons as named
 * imports). The bottom bar becomes an actual editor status bar
 * (branch, filetype, cursor position) instead of a plain info strip.
 *
 * Custom syntax palette (not the default green-on-black terminal look):
 *   --syntax-bg        #12151B   deep ink, not pure black
 *   --syntax-keyword   #7FD8C6   muted teal  (const, import, export…)
 *   --syntax-string     #E6A5B8   dusty rose  (string literals)
 *   --syntax-func       #E8B75E   soft gold   (property keys)
 *   --syntax-comment    var(--color-mutedForeground)
 *
 * Drop this in place of the two <div>s in your hero (the centered
 * content block + bottom bar). Assumes `Link`, `ArrowUpRight`,
 * `LiveClock`, and `SOCIALS` are already available in scope, same as
 * your original file. Add these two imports if not already present:
 *   import { GitBranch, MapPin, Play } from "lucide-react";
 * If this file isn't already a client component, keep "use client"
 * at the top — needed for the mount-triggered line animation.
 * ──────────────────────────────────────────────────────────────── */

import { GitBranch, MapPin, Play } from "lucide-react";

const STACK = ["React", "Next.js", "Node.js", "TypeScript"];

export function HeroCode({
  contentRef,
  botRef,
}: {
  contentRef: React.RefObject<HTMLDivElement>;
  botRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <>
      <style>{`
        @keyframes codeLineIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .code-line {
          animation: codeLineIn 0.35s ease both;
        }
        @media (prefers-reduced-motion: reduce) {
          .code-line { animation: none; }
        }
      `}</style>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
          padding: "2rem 1rem",
        }}
      >
        <div
          ref={contentRef}
          className="col"
          style={{
            width: "100%",
            maxWidth: "640px",
            fontFamily: "var(--font-mono, ui-monospace, 'SF Mono', Menlo, monospace)",
            // local syntax palette, scoped to this block
            ["--syntax-bg" as any]: "#12151B",
            ["--syntax-line" as any]: "#1C2029",
            ["--syntax-keyword" as any]: "#7FD8C6",
            ["--syntax-string" as any]: "#E6A5B8",
            ["--syntax-func" as any]: "#E8B75E",
          }}
        >
          {/* ── Window chrome ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.7rem 1rem",
              backgroundColor: "var(--syntax-line)",
              border: "1px solid var(--color-border)",
              borderBottom: "none",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
            }}
          >
            <div style={{ display: "flex", gap: "0.4rem" }}>
              {["#E6A5B8", "#E8B75E", "#7FD8C6"].map((c) => (
                <span
                  key={c}
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    backgroundColor: "var(--color-border)",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLSpanElement).style.backgroundColor = c)}
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLSpanElement).style.backgroundColor = "var(--color-border)")
                  }
                />
              ))}
            </div>

            <div style={{ display: "flex", gap: "0.25rem", marginLeft: "0.5rem" }}>
              <span
                className="type-label"
                style={{
                  padding: "0.3rem 0.7rem",
                  backgroundColor: "var(--syntax-bg)",
                  color: "var(--color-foreground)",
                  borderRadius: "5px 5px 0 0",
                  fontSize: "0.7rem",
                }}
              >
                hero.tsx
              </span>
              <Link
                href="/about"
                className="type-label"
                style={{
                  padding: "0.3rem 0.7rem",
                  color: "var(--color-mutedForeground)",
                  textDecoration: "none",
                  fontSize: "0.7rem",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--color-foreground)")}
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "var(--color-mutedForeground)")
                }
              >
                about.ts
              </Link>
            </div>
          </div>

          {/* ── Code panel ── */}
          <div
            style={{
              backgroundColor: "var(--syntax-bg)",
              border: "1px solid var(--color-border)",
              borderRadius: "0 0 8px 8px",
              padding: "1.5rem 0",
              fontSize: "0.8rem",
              lineHeight: 1.9,
            }}
          >
            {[
              <>
                <Keyword>import</Keyword> {"{ "}
                {SOCIALS.map(({ href, icon, label }: any, i: number) => (
                  <Link
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    style={{ color: "inherit", display: "inline-flex", verticalAlign: "middle", margin: "0 2px" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--syntax-keyword)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "inherit")}
                  >
                    {icon}
                    {i < SOCIALS.length - 1 && <Punct>,</Punct>}
                  </Link>
                ))}
                {" }"} <Keyword>from</Keyword> <Str>"./asep"</Str>
                <Punct>;</Punct>
              </>,
              <>&nbsp;</>,
              <>
                <Comment>
                  {"/** "}
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: "var(--color-accent)",
                        display: "inline-block",
                        animation: "cursor-blink 2s ease infinite",
                      }}
                    />
                    open to work · <LiveClock />
                  </span>
                  {" */"}
                </Comment>
              </>,
              <>
                <Keyword>const</Keyword> developer = {"{"}
              </>,
              <Field name="name" value={`"Asep Saepudin"`} />,
              <Field name="role" value={`"Fullstack Web Developer"`} />,
              <Field name="location" value={`"Bandung, Indonesia 🇮🇩"`} />,
              <>
                &nbsp;&nbsp;<Fn>stack</Fn>: [
                {STACK.map((s, i) => (
                  <span key={s}>
                    <Str>"{s}"</Str>
                    {i < STACK.length - 1 && <Punct>, </Punct>}
                  </span>
                ))}
                ],
              </>,
              <Field name="experience" value={`"3+ yrs · 20+ shipped projects"`} />,
              <Field name="bio" value={`"clean backends, pixel-perfect frontends, things that ship and last."`} last />,
              <>{"}"};</>,
              <>&nbsp;</>,
              <>
                <Keyword>export default</Keyword> developer<Punct>;</Punct>
                <span
                  style={{
                    display: "inline-block",
                    width: 7,
                    height: "1em",
                    marginLeft: "0.35rem",
                    verticalAlign: "text-bottom",
                    backgroundColor: "var(--color-accent)",
                    animation: "cursor-blink 1s step-end infinite",
                  }}
                />
              </>,
            ].map((line, i) => (
              <div
                key={i}
                className="code-line"
                style={{
                  display: "flex",
                  gap: "1.25rem",
                  padding: "0 1.5rem",
                  animationDelay: `${i * 0.06}s`,
                  color: "var(--color-foreground)",
                }}
              >
                <span
                  className="type-index"
                  style={{
                    color: "var(--color-mutedForeground)",
                    opacity: 0.4,
                    minWidth: "1.2rem",
                    textAlign: "right",
                    userSelect: "none",
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ whiteSpace: "pre-wrap" }}>{line}</span>
              </div>
            ))}
          </div>

          {/* ── Run command ── */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "1.75rem" }}>
            <Link
              href="/project"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.65rem 1.5rem",
                backgroundColor: "var(--color-foreground)",
                color: "var(--color-background)",
                textDecoration: "none",
                fontSize: "0.75rem",
                letterSpacing: "0.02em",
                borderRadius: "5px",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.85")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
            >
              <Play size={11} strokeWidth={2.5} /> run ./work
            </Link>
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
          paddingBlock: "0.6rem",
          borderTop: "1px solid var(--color-border)",
          fontFamily: "var(--font-mono, ui-monospace, monospace)",
          fontSize: "0.7rem",
          color: "var(--color-mutedForeground)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
          <GitBranch size={11} /> main
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
          <MapPin size={11} /> Bandung, Indonesia
        </span>
        <span>{STACK.join(" · ")}</span>
        <span>TSX · UTF-8 · Ln 14, Col 1</span>
      </div>
    </>
  );
}

/* ── Syntax helper components ── */
function Keyword({ children }: { children: React.ReactNode }) {
  return <span style={{ color: "var(--syntax-keyword)" }}>{children}</span>;
}
function Str({ children }: { children: React.ReactNode }) {
  return <span style={{ color: "var(--syntax-string)" }}>{children}</span>;
}
function Fn({ children }: { children: React.ReactNode }) {
  return <span style={{ color: "var(--syntax-func)" }}>{children}</span>;
}
function Comment({ children }: { children: React.ReactNode }) {
  return <span style={{ color: "var(--color-mutedForeground)", fontStyle: "italic" }}>{children}</span>;
}
function Punct({ children }: { children: React.ReactNode }) {
  return <span style={{ color: "var(--color-mutedForeground)" }}>{children}</span>;
}
function Field({ name, value, last }: { name: string; value: string; last?: boolean }) {
  return (
    <>
      &nbsp;&nbsp;<Fn>{name}</Fn>: <Str>{value}</Str>
      {!last && <Punct>,</Punct>}
    </>
  );
}
