"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import { Menu, X } from "lucide-react";
import SectionLabel from "../ui/SectionLabel";

const NAV = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/project" },
  { label: "Posts", href: "/posts" },
  { label: "Pics", href: "/pics" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          borderBottom: scrolled ? "1px solid var(--color-border)" : "1px solid transparent",
          backgroundColor: scrolled ? "color-mix(in srgb, var(--color-background) 90%, transparent)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
        }}
      >
        <div className="col flex items-center justify-between" style={{ height: "3.5rem" }}>
          {/* Logo — wordmark only */}
          <Link
            href="/"
            style={{
              // color: "var(--color-accentText)",
              fontSize: "0.8rem",
              letterSpacing: "0.12em",
              textDecoration: "none",
              fontWeight: 500,
            }}
            aria-label="Home"
          >
            <SectionLabel n="00">COSMIC</SectionLabel>
          </Link>

          <div className="flex items-center gap-3">
            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
              {NAV.map(({ label, href }) => {
                const active = pathname === href || (href !== "/" && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    className="type-label link-draw"
                    style={{
                      color: active ? "var(--color-foreground)" : "var(--color-mutedForeground)",
                      textDecoration: "none",
                    }}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-3">
              <ThemeSwitcher />
              <button
                className="md:hidden"
                style={{ color: "var(--color-foreground)", background: "none", border: "none", padding: "4px" }}
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Close menu" : "Open menu"}
              >
                {open ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {open && (
        <div
          className="fixed inset-0 z-40 flex flex-col pt-14 animate-slide-down"
          style={{ backgroundColor: "var(--color-background)" }}
        >
          <nav className="col flex flex-col gap-1 pt-8" aria-label="Mobile navigation">
            {NAV.map(({ label, href }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className="py-4"
                  style={{
                    borderBottom: "1px solid var(--color-border)",
                    color: active ? "var(--color-foreground)" : "var(--color-mutedForeground)",
                    textDecoration: "none",
                    fontFamily: "var(--font-editorial)",
                    fontSize: "2rem",
                    letterSpacing: "-0.02em",
                    display: "block",
                  }}
                >
                  {label}
                  {active && <span style={{ color: "var(--color-accentText)", marginLeft: "0.25em" }}>·</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
