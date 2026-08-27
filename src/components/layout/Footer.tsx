"use client";

export default function Footer() {
  return (
    <footer
      className="col"
      style={{
        borderTop: "1px solid var(--color-border)",
        paddingBlock: "1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        flexWrap: "wrap",
      }}
    >
      <p className="type-index">© {new Date().getFullYear()} Asep Saepudin</p>
      <p className="type-index">Built with Next.js · Deployed on Vercel</p>
    </footer>
  );
}
