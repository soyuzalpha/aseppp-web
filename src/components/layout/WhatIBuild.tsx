"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TABS = [
  {
    id: "saas",
    label: "SaaS Products",
    emoji: "🚀",
    headline: "Ship SaaS products fast",
    description:
      "From auth and billing to dashboards and APIs — I build SaaS MVPs and production platforms that scale. Full feature development cycle: planning, architecture, implementation, and deployment.",
    points: [
      "User authentication & authorization (JWT, OAuth2)",
      "Subscription billing (Stripe integration)",
      "Admin dashboards & analytics",
      "Multi-tenant architecture",
      "Email systems & notifications",
    ],
    visual: {
      label: "SaaS architecture",
      nodes: ["Auth", "API Gateway", "Database", "Cache", "Queue", "Email"],
      color: "primary",
    },
  },
  {
    id: "ecommerce",
    label: "E-Commerce",
    emoji: "🛒",
    headline: "E-Commerce that converts",
    description:
      "High-performance storefronts with seamless checkout flows, inventory management, and payment processing. Built for speed, SEO, and conversion — optimized down to the last byte.",
    points: [
      "Product catalog with search & filters",
      "Cart & checkout optimization",
      "Payment gateway integration",
      "Order management system",
      "Inventory tracking",
    ],
    visual: {
      label: "Commerce stack",
      nodes: ["Storefront", "Search", "Cart", "Payment", "Orders", "Analytics"],
      color: "accent",
    },
  },
  {
    id: "dashboard",
    label: "Dashboards",
    emoji: "📊",
    headline: "Data-rich dashboards",
    description:
      "Real-time dashboards and data visualization tools that turn raw data into insights. Interactive charts, live updates, and exportable reports — built to handle thousands of concurrent users.",
    points: [
      "Real-time data with WebSocket",
      "Interactive charts & visualizations",
      "Filtering, sorting, pagination",
      "Export to CSV / PDF",
      "Role-based data access",
    ],
    visual: {
      label: "Dashboard pipeline",
      nodes: ["Data sources", "ETL", "Cache", "API", "Charts", "Alerts"],
      color: "primary",
    },
  },
  {
    id: "api",
    label: "APIs & Backends",
    emoji: "⚙️",
    headline: "Production-grade APIs",
    description:
      "Clean, documented, testable backends that your frontend team will love. RESTful or GraphQL, with proper versioning, error handling, logging, and performance monitoring from day one.",
    points: [
      "RESTful & GraphQL APIs",
      "Auto-generated API documentation",
      "Rate limiting & security headers",
      "Structured logging & tracing",
      "Automated testing (unit + integration)",
    ],
    visual: {
      label: "API layers",
      nodes: ["Router", "Middleware", "Controller", "Service", "Repository", "DB"],
      color: "accent",
    },
  },
];

export default function WhatIBuild() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headRef.current, {
        y: 40, opacity: 0, duration: 0.8, ease: "expo.out",
        scrollTrigger: { trigger: headRef.current, start: "top 88%" },
      });
      gsap.from(contentRef.current, {
        y: 30, opacity: 0, duration: 0.7, ease: "expo.out",
        scrollTrigger: { trigger: contentRef.current, start: "top 85%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!contentRef.current) return;
    gsap.from(contentRef.current.querySelectorAll(".tab-panel-item"), {
      y: 20, opacity: 0, duration: 0.4, stagger: 0.07, ease: "expo.out",
    });
  }, [activeTab]);

  const tab = TABS[activeTab];

  return (
    <section ref={sectionRef} className="py-28 relative" aria-labelledby="whatibuild-heading">
      <div className="section-divider mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div ref={headRef} className="max-w-xl mb-12">
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em] mb-4"
            style={{ color: "var(--color-primary)" }}
          >
            Expertise
          </p>
          <h2
            id="whatibuild-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
            style={{
              color: "var(--color-foreground)",
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.03em",
            }}
          >
            What I build
          </h2>
        </div>

        {/* Tab pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {TABS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(i)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-250"
              style={
                activeTab === i
                  ? {
                      backgroundColor: "var(--color-primary)",
                      color: "var(--color-primaryForeground)",
                      boxShadow: "0 0 16px color-mix(in srgb, var(--color-primary) 30%, transparent)",
                    }
                  : {
                      backgroundColor: "color-mix(in srgb, var(--color-card) 80%, transparent)",
                      color: "var(--color-mutedForeground)",
                      border: "1px solid var(--color-border)",
                    }
              }
            >
              <span>{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div
          ref={contentRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 sm:p-8 rounded-3xl"
          style={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          {/* Left — text */}
          <div className="flex flex-col justify-center">
            <h3
              className="tab-panel-item text-2xl sm:text-3xl font-bold mb-4"
              style={{
                color: "var(--color-foreground)",
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.02em",
              }}
            >
              {tab.emoji} {tab.headline}
            </h3>
            <p className="tab-panel-item text-base leading-relaxed mb-6" style={{ color: "var(--color-mutedForeground)" }}>
              {tab.description}
            </p>
            <ul className="flex flex-col gap-2.5">
              {tab.points.map((pt) => (
                <li
                  key={pt}
                  className="tab-panel-item flex items-start gap-2.5 text-sm"
                  style={{ color: "var(--color-foreground)" }}
                >
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: `var(--color-${tab.visual.color})` }}
                    aria-hidden="true"
                  />
                  {pt}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — visual */}
          <div
            className="tab-panel-item flex flex-col items-center justify-center gap-4 rounded-2xl p-6 relative overflow-hidden"
            style={{
              backgroundColor: "color-mix(in srgb, var(--color-background) 50%, transparent)",
              border: "1px solid var(--color-border)",
              minHeight: 260,
            }}
          >
            {/* Ambient glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 60% 60% at 50% 100%, color-mix(in srgb, var(--color-${tab.visual.color}) 10%, transparent) 0%, transparent 70%)`,
              }}
              aria-hidden="true"
            />

            <p
              className="text-[11px] font-semibold uppercase tracking-widest relative z-10"
              style={{ color: "var(--color-mutedForeground)" }}
            >
              {tab.visual.label}
            </p>

            {/* Node pipeline */}
            <div className="flex flex-wrap justify-center gap-2 relative z-10">
              {tab.visual.nodes.map((node, i) => (
                <div
                  key={node}
                  className="flex items-center gap-1"
                >
                  <span
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                    style={{
                      backgroundColor: `color-mix(in srgb, var(--color-${tab.visual.color}) 12%, var(--color-card))`,
                      color: `var(--color-${tab.visual.color})`,
                      border: `1px solid color-mix(in srgb, var(--color-${tab.visual.color}) 25%, transparent)`,
                    }}
                  >
                    {node}
                  </span>
                  {i < tab.visual.nodes.length - 1 && (
                    <span style={{ color: "var(--color-border)", fontSize: 16 }}>→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
