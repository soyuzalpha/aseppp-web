"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AiOutlineGithub, AiFillLinkedin, AiOutlineInstagram } from "react-icons/ai";
import SectionLabel from "@/components/ui/SectionLabel";

gsap.registerPlugin(ScrollTrigger);

const LINKS = [
  { label: "Email", href: "mailto:asepp.saepudiin@gmail.com", display: "asepp.saepudiin@gmail.com" },
  { label: "GitHub", href: "https://github.com/aseppp", display: "github.com/aseppp" },
  { label: "LinkedIn", href: "https://linkedin.com/in/aseppp", display: "linkedin.com/in/aseppp" },
];

export default function Contact() {
  const secRef  = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headRef.current?.children ?? [], {
        yPercent: 110,
        duration: 1.0,
        stagger: 0.07,
        ease: "expo.out",
        scrollTrigger: { trigger: headRef.current, start: "top 85%" },
      });
      gsap.from(bodyRef.current?.children ?? [], {
        opacity: 0,
        y: 20,
        stagger: 0.08,
        duration: 0.7,
        ease: "expo.out",
        scrollTrigger: { trigger: bodyRef.current, start: "top 88%" },
      });
    }, secRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={secRef} aria-labelledby="contact-label" style={{ paddingBlock: "5rem 6rem" }}>
      {/* Header row */}
      <div
        className="col flex items-baseline justify-between pb-5"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <span id="contact-label">
          <SectionLabel n="04">Contact</SectionLabel>
        </span>
      </div>

      {/* Giant CTA headline */}
      <div className="col pt-10 pb-12" style={{ overflow: "hidden" }}>
        <h2
          ref={headRef}
          style={{ overflow: "hidden" }}
          aria-label="Let's build something together."
        >
          {["Let's build", "something", "together."].map((word, i) => (
            <span key={i} className="block overflow-hidden">
              <span
                className={i === 2 ? "type-display-outline block" : "type-display block"}
                style={{
                  color: i === 2 ? "transparent" : "var(--color-foreground)",
                }}
              >
                {word}
              </span>
            </span>
          ))}
        </h2>
      </div>

      {/* Links grid */}
      <div ref={bodyRef} className="col">
        {LINKS.map(({ label, href, display }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("mailto") ? undefined : "_blank"}
            rel="noopener noreferrer"
            className="link-draw"
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              paddingBlock: "1.2rem",
              borderBottom: "1px solid var(--color-border)",
              textDecoration: "none",
              color: "var(--color-foreground)",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = "var(--color-accent)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = "var(--color-foreground)")
            }
          >
            <span className="type-label" style={{ color: "inherit" }}>{label}</span>
            <span
              style={{
                fontFamily: "var(--font-medium)",
                fontSize: "clamp(0.875rem, 1.4vw, 1.05rem)",
                letterSpacing: "-0.01em",
                color: "inherit",
              }}
            >
              {display}
            </span>
          </a>
        ))}

        <p
          className="type-index mt-8"
          style={{ opacity: 0.5 }}
        >
          Usually replies within 24 hrs
        </p>
      </div>
    </section>
  );
}
