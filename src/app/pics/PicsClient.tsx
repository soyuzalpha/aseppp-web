"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { X, ZoomIn } from "lucide-react";
import Footer from "@/components/layout/Footer";
import SectionLabel from "@/components/ui/SectionLabel";
import type { Photo } from "@/lib/types";


export default function PicsClient({ photos }: { photos: Photo[] }) {
  const pageRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [cat, setCat] = useState("All");
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  const cats = ["All", ...Array.from(new Set(photos.map((p) => p.cat)))];
  const filtered = cat === "All" ? photos : photos.filter((p) => p.cat === cat);

  useEffect(() => {
    gsap.from(gridRef.current?.querySelectorAll(".pic-item") ?? [], {
      opacity: 0, scale: 0.96, duration: 0.55, stagger: 0.05, ease: "expo.out",
    });
  }, [cat]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".page-title", { opacity: 0, y: 30, duration: 0.8, ease: "expo.out" });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  // Lightbox keyboard nav
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (!lightbox) return;
      const idx = filtered.findIndex((p) => p.id === lightbox.id);
      if (e.key === "ArrowRight") setLightbox(filtered[(idx + 1) % filtered.length]);
      if (e.key === "ArrowLeft") setLightbox(filtered[(idx - 1 + filtered.length) % filtered.length]);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [lightbox, filtered]);

  // Lock scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  return (
    <div ref={pageRef}>
      <main style={{ paddingTop: "5rem" }}>

        {/* ── Title ── */}
        <div
          className="col"
          style={{ paddingTop: "3rem", paddingBottom: "2rem", borderBottom: "1px solid var(--color-border)" }}
        >
          <p className="mb-3">
            <SectionLabel n="04">Hobby</SectionLabel>
          </p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <h1 className="type-title page-title" style={{ color: "var(--color-foreground)" }}>
              Pics
            </h1>
            <span className="type-index">{photos.length} photos</span>
          </div>
          <p
            className="type-body mt-3"
            style={{ color: "var(--color-mutedForeground)", maxWidth: "48ch" }}
          >
            Moments from travel, daily life, and wherever curiosity takes me.
            Shot mostly on phone, occasionally on camera.
          </p>
        </div>

        {/* ── Category filter ── */}
        <div
          className="col flex flex-wrap gap-4"
          style={{ paddingBlock: "1.25rem", borderBottom: "1px solid var(--color-border)" }}
        >
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className="tap-target"
              style={{
                background: "none",
                border: "none",
                padding: "0.2rem 0",
                fontFamily: "var(--font-body)",
                fontSize: "0.6875rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontWeight: 500,
                cursor: "default",
                color: cat === c ? "var(--color-foreground)" : "var(--color-mutedForeground)",
                borderBottom: cat === c ? "1px solid var(--color-accentText)" : "1px solid transparent",
                transition: "color 0.2s ease",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* ── Masonry grid ── */}
        <div
          ref={gridRef}
          className="col"
          style={{
            paddingBlock: "2.5rem",
            columns: "clamp(200px, 30vw, 340px)",
            columnGap: "1px",
          }}
        >
          {filtered.map((photo) => (
            <div
              key={photo.id}
              className="pic-item"
              onClick={() => setLightbox(photo)}
              style={{
                breakInside: "avoid",
                marginBottom: "1px",
                position: "relative",
                overflow: "hidden",
                cursor: "default",
                display: "block",
                aspectRatio: photo.w === 2 ? "16/9" : photo.h === 2 ? "3/4" : "1/1",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.5s var(--ease-out-expo)",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
              />
              {/* Glass overlay on hover */}
              <div
                className="pic-overlay"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "color-mix(in srgb, var(--color-background) 50%, transparent)",
                  backdropFilter: "blur(2px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "1rem",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.opacity = "1")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.opacity = "0")}
              >
                <span
                  className="tag"
                  style={{
                    alignSelf: "flex-start",
                    backgroundColor: "color-mix(in srgb, var(--color-card) 70%, transparent)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {photo.cat}
                </span>
                <div className="flex items-end justify-between">
                  <p
                    style={{
                      fontFamily: "var(--font-medium)",
                      fontSize: "0.8125rem",
                      color: "var(--color-foreground)",
                      lineHeight: 1.3,
                      maxWidth: "20ch",
                    }}
                  >
                    {photo.alt}
                  </p>
                  <ZoomIn size={16} strokeWidth={1.5} style={{ color: "var(--color-foreground)", flexShrink: 0 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "color-mix(in srgb, var(--color-background) 92%, transparent)",
            backdropFilter: "blur(24px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
          onClick={() => setLightbox(null)}
        >
          {/* Close */}
          <button
            onClick={() => setLightbox(null)}
            aria-label="Close lightbox"
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "1.5rem",
              background: "none",
              border: "none",
              color: "var(--color-foreground)",
              padding: 0,
            }}
          >
            <X size={20} strokeWidth={1.5} />
          </button>

          {/* Image */}
          <div
            style={{ maxWidth: "min(90vw, 900px)", maxHeight: "80vh", width: "100%" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              style={{
                width: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
                display: "block",
              }}
            />
            {/* Caption glass panel */}
            <div
              className="glass-panel"
              style={{
                marginTop: "1px",
                padding: "0.875rem 1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-medium)",
                  fontSize: "0.875rem",
                  color: "var(--color-foreground)",
                }}
              >
                {lightbox.alt}
              </p>
              <span className="tag">{lightbox.cat}</span>
            </div>
          </div>

          {/* Arrow nav */}
          {filtered.length > 1 && (
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "1.5rem",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {["←", "→"].map((arrow, i) => {
                const idx = filtered.findIndex((p) => p.id === lightbox.id);
                const next = i === 0
                  ? filtered[(idx - 1 + filtered.length) % filtered.length]
                  : filtered[(idx + 1) % filtered.length];
                return (
                  <button
                    key={arrow}
                    onClick={() => setLightbox(next)}
                    style={{
                      background: "color-mix(in srgb, var(--color-card) 70%, transparent)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-foreground)",
                      padding: "0.6rem 1.2rem",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.875rem",
                      cursor: "default",
                      transition: "border-color 0.2s ease",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-foreground)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-border)")}
                  >
                    {arrow}
                  </button>
                );
              })}
            </div>
          )}

          <p className="type-index mt-4" style={{ opacity: 0.5 }}>
            Click outside or press Esc to close · ← → to navigate
          </p>
        </div>
      )}

      <Footer />
    </div>
  );
}
