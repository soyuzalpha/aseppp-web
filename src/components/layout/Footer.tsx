"use client";

import { AiOutlineGithub, AiFillLinkedin, AiOutlineInstagram } from "react-icons/ai";

const SOCIALS = [
  { href: "https://github.com/soyuzalpha", icon: <AiOutlineGithub size={16} />, label: "GitHub" },
  { href: "https://linkedin.com/in/aseppp", icon: <AiFillLinkedin size={16} />, label: "LinkedIn" },
  { href: "https://instagram.com/soyuz.beta", icon: <AiOutlineInstagram size={16} />, label: "Instagram" },
];

export default function Footer() {
  return (
    <footer
      className="col"
      style={{
        marginBottom: "20px",
        border: "1px solid var(--color-border)",
        paddingBlock: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        flexWrap: "wrap",
      }}
    >
      <p className="type-index">© {new Date().getFullYear()} Asep Saepudin</p>

      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
        {SOCIALS.map(({ href, icon, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="icon-hit"
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
          style={{ color: "var(--color-mutedForeground)", textDecoration: "none", overflowWrap: "anywhere", minWidth: 0 }}
        >
          asepp.saepudiin@gmail.com
        </a>
      </div>
    </footer>
  );
}
