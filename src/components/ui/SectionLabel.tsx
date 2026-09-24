// Slide-label pattern shared across the site: "// NN · LABEL"
export default function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <span className="type-label text-base" style={{ display: "inline-flex", gap: "0.6em", alignItems: "baseline" }}>
      <span>{"//"}</span>
      <span>{n}</span>
      <span>·</span>
      <span>{children}</span>
    </span>
  );
}
