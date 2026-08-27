"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Mail } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function CTABlock() {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(innerRef.current?.children ?? [], {
        y: 40, opacity: 0, duration: 0.7, stagger: 0.12, ease: "expo.out",
        scrollTrigger: { trigger: innerRef.current, start: "top 85%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 relative" aria-labelledby="cta-heading">
      <div className="section-divider mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          className="relative overflow-hidden rounded-3xl p-8 sm:p-12 lg:p-16 text-center"
          style={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          {/* Ambient blobs */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in srgb, var(--color-primary) 18%, transparent) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 left-1/4 w-80 h-48 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse, color-mix(in srgb, var(--color-accent) 12%, transparent) 0%, transparent 70%)",
              filter: "blur(50px)",
            }}
            aria-hidden="true"
          />

          <div ref={innerRef} className="relative z-10 flex flex-col items-center">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border"
              style={{
                backgroundColor: "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                borderColor: "color-mix(in srgb, var(--color-primary) 25%, transparent)",
                color: "var(--color-primary)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "var(--color-primary)" }} />
              Available for new projects
            </span>

            <h2
              id="cta-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5 max-w-2xl"
              style={{
                color: "var(--color-foreground)",
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.03em",
              }}
            >
              Have a project in mind?{" "}
              <span className="gradient-text">Let&apos;s talk.</span>
            </h2>

            <p
              className="text-base sm:text-lg leading-relaxed max-w-xl mb-8"
              style={{ color: "var(--color-mutedForeground)" }}
            >
              Whether it&apos;s a SaaS MVP, a complex API, or a redesign — I bring both technical depth and product thinking to every project.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="mailto:asepp.saepudiin@gmail.com"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-[1.04] active:scale-[0.97]"
                style={{
                  background: "linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 70%, var(--color-accent)))",
                  color: "var(--color-primaryForeground)",
                  boxShadow: "0 0 28px color-mix(in srgb, var(--color-primary) 35%, transparent)",
                }}
              >
                <Mail size={16} />
                Send me an email
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="https://www.linkedin.com/in/aseppp/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-[1.04] active:scale-[0.97]"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--color-foreground) 8%, transparent)",
                  color: "var(--color-foreground)",
                  border: "1px solid var(--color-border)",
                }}
              >
                Connect on LinkedIn
              </a>
            </div>

            {/* Trust line */}
            <p className="mt-8 text-xs" style={{ color: "var(--color-mutedForeground)", opacity: 0.6 }}>
              Usually replies within 24 hours · asepp.saepudiin@gmail.com
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
