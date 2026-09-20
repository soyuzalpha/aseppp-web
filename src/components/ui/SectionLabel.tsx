// Slide-label pattern shared across the site: "// NN · LABEL"
export default function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <span className="type-label" style={{ display: "inline-flex", gap: "0.6em", alignItems: "baseline" }}>
      <span style={{ color: "var(--color-accent)" }}>{"//"}</span>
      <span>{n}</span>
      <span>·</span>
      <span>{children}</span>
    </span>
  );
}
