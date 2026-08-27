"use client";

import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect, useRef } from "react";
import { Check, X } from "lucide-react";
import { Moon, Sun } from "lucide-react";

type Tab = "theme" | "font";

export default function ThemeSwitcher() {
  const { theme, mode, availableThemes, setTheme, toggleMode, font, availableFonts, setFont } = useTheme();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("theme");
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      )
        setOpen(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", fn);
      document.removeEventListener("keydown", key);
    };
  }, []);

  const current = availableThemes.find((t) => t.name === theme);
  const currentFont = availableFonts.find((f) => f.id === font);
  const c = current?.[mode];

  /* shared button styles */
  const tabBtn = (active: boolean) => ({
    flex: 1,
    background: active ? "var(--color-secondary)" : "none",
    border: "none",
    padding: "0.5rem",
    color: active ? "var(--color-foreground)" : "var(--color-mutedForeground)",
    fontFamily: "var(--font-body)",
    fontSize: "0.6875rem",
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    cursor: "default",
    borderBottom: active ? `1px solid var(--color-accent)` : "1px solid transparent",
    transition: "background 0.15s ease, color 0.15s ease",
  });

  return (
    <div className="relative flex items-center gap-3">
      {/* Swatch trigger */}
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        aria-label="Appearance settings"
        aria-expanded={open}
        style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", gap: "4px" }}
      >
        {[c?.background, c?.primary, c?.accent].map((col, i) => (
          <span
            key={i}
            style={{
              display: "block",
              width: i === 1 ? "10px" : "8px",
              height: i === 1 ? "10px" : "8px",
              borderRadius: "50%",
              backgroundColor: col ?? "var(--color-foreground)",
              border: "1px solid color-mix(in srgb, var(--color-border) 70%, transparent)",
            }}
          />
        ))}
      </button>

      {/* Mode toggle */}
      <button
        onClick={toggleMode}
        aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 28,
          height: 28,
          padding: 0,
          border: "none",
          background: "none",
          color: "var(--color-mutedForeground)",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            display: "flex",
            transform: `rotate(${mode === "dark" ? 0 : 180}deg) scale(${mode === "dark" ? 1 : 0.85})`,
            transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s ease",
          }}
        >
          {mode === "dark" ? <Moon size={15} strokeWidth={1.5} /> : <Sun size={15} strokeWidth={1.5} />}
        </span>
      </button>

      {/* ── Panel ── */}
      {open && (
        <div
          ref={panelRef}
          className="animate-slide-down"
          style={{
            position: "absolute",
            top: "calc(100% + 12px)",
            right: 0,
            width: "300px",
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            zIndex: 100,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.875rem 1rem",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <div>
              <span className="type-label">Appearance</span>
              <span className="type-index" style={{ marginLeft: "0.5rem", color: "var(--color-accent)" }}>
                {current?.displayName} · {currentFont?.label}
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", padding: 0, color: "var(--color-mutedForeground)" }}
              aria-label="Close"
            >
              <X size={13} />
            </button>
          </div>

          {/* Tab bar */}
          <div
            style={{
              display: "flex",
              gap: "1px",
              backgroundColor: "var(--color-border)",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            {(["theme", "font"] as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)} style={tabBtn(tab === t)}>
                {t}
              </button>
            ))}
          </div>

          {/* Mode row — always visible */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1px",
              backgroundColor: "var(--color-border)",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            {(["light", "dark"] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  if (mode !== m) toggleMode();
                }}
                style={{
                  background: mode === m ? "var(--color-secondary)" : "var(--color-card)",
                  border: "none",
                  padding: "0.5rem",
                  color: mode === m ? "var(--color-foreground)" : "var(--color-mutedForeground)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.6875rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  cursor: "default",
                  transition: "background 0.15s ease",
                }}
              >
                {m}
                {mode === m && <span style={{ marginLeft: "0.4em", color: "var(--color-accent)" }}>·</span>}
              </button>
            ))}
          </div>

          {/* ── Theme tab ── */}
          {tab === "theme" && (
            <div style={{ maxHeight: "280px", overflowY: "auto" }}>
              {availableThemes.map((t) => {
                const tc = t[mode];
                const isActive = theme === t.name;
                return (
                  <button
                    key={t.name}
                    onClick={() => {
                      setTheme(t.name);
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.625rem 1rem",
                      background: isActive ? "var(--color-secondary)" : "none",
                      border: "none",
                      borderBottom: "1px solid var(--color-border)",
                      cursor: "default",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive)
                        (e.currentTarget as HTMLButtonElement).style.background =
                          "color-mix(in srgb, var(--color-foreground) 4%, transparent)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "none";
                    }}
                  >
                    {/* Swatch strip */}
                    <div style={{ display: "flex", gap: "2px", flexShrink: 0 }}>
                      {[tc.background, tc.primary, tc.accent, tc.secondary].map((col, i) => (
                        <span
                          key={i}
                          style={{
                            display: "block",
                            width: "14px",
                            height: "14px",
                            backgroundColor: col,
                            borderRadius: "2px",
                          }}
                        />
                      ))}
                    </div>
                    <span
                      style={{
                        flex: 1,
                        textAlign: "left",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.8125rem",
                        color: "var(--color-foreground)",
                      }}
                    >
                      {t.displayName}
                    </span>
                    {isActive && <Check size={12} style={{ color: "var(--color-accent)", flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Font tab ── */}
          {tab === "font" && (
            <div style={{ maxHeight: "280px", overflowY: "auto" }}>
              {availableFonts.map((f) => {
                const isActive = font === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setFont(f.id)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.75rem 1rem",
                      background: isActive ? "var(--color-secondary)" : "none",
                      border: "none",
                      borderBottom: "1px solid var(--color-border)",
                      cursor: "default",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive)
                        (e.currentTarget as HTMLButtonElement).style.background =
                          "color-mix(in srgb, var(--color-foreground) 4%, transparent)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "none";
                    }}
                  >
                    {/* Live sample rendered in that font */}
                    <span
                      style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        backgroundColor: isActive
                          ? "color-mix(in srgb, var(--color-accent) 12%, transparent)"
                          : "color-mix(in srgb, var(--color-foreground) 5%, transparent)",
                        borderRadius: "2px",
                        fontSize: "1.1rem",
                        fontFamily: f.editorial,
                        fontWeight: 700,
                        color: isActive ? "var(--color-accent)" : "var(--color-foreground)",
                        letterSpacing: "-0.03em",
                      }}
                    >
                      Ag
                    </span>

                    <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
                      <p
                        style={{
                          fontFamily: f.body,
                          fontSize: "0.8125rem",
                          fontWeight: 500,
                          color: "var(--color-foreground)",
                          marginBottom: "0.15rem",
                          lineHeight: 1,
                        }}
                      >
                        {f.label}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.625rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "var(--color-mutedForeground)",
                        }}
                      >
                        {f.character}
                      </p>
                    </div>

                    {isActive && <Check size={12} style={{ color: "var(--color-accent)", flexShrink: 0 }} />}
                  </button>
                );
              })}

              {/* Footer note */}
              <p
                style={{
                  padding: "0.75rem 1rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.625rem",
                  letterSpacing: "0.08em",
                  color: "var(--color-mutedForeground)",
                  textTransform: "uppercase",
                  borderTop: "1px solid var(--color-border)",
                }}
              >
                Font applies site-wide · saved to local storage
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
