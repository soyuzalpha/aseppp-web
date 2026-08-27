export interface FontPair {
  id: string;
  label: string;
  /** CSS @import URL (empty if system font) */
  import?: string;
  /** Actual font-family value for body / --font-body */
  body: string;
  /** Actual font-family value for headings / --font-editorial */
  editorial: string;
  /** Actual font-family value for --font-medium */
  medium: string;
  /** One-word character description shown in picker */
  character: string;
  /** Sample string rendered in the font itself */
  sample: string;
}

export const fontPairs: FontPair[] = [
  {
    id: "default",
    label: "Gilmer",
    body: '"Inter", system-ui, sans-serif',
    editorial: '"Gilmer-Bold", "Inter", sans-serif',
    medium: '"Gilmer-Medium", "Inter", sans-serif',
    character: "Signature",
    sample: "Aa",
  },
  {
    id: "inter",
    label: "Inter",
    import: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap",
    body: '"Inter", system-ui, sans-serif',
    editorial: '"Inter", system-ui, sans-serif',
    medium: '"Inter", system-ui, sans-serif',
    character: "Clean",
    sample: "Aa",
  },
  {
    id: "geist",
    label: "Geist",
    import: "https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&display=swap",
    body: '"Geist", system-ui, sans-serif',
    editorial: '"Geist", system-ui, sans-serif',
    medium: '"Geist", system-ui, sans-serif',
    character: "Modern",
    sample: "Aa",
  },
  {
    id: "space-grotesk",
    label: "Space Grotesk",
    import: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap",
    body: '"Space Grotesk", system-ui, sans-serif',
    editorial: '"Space Grotesk", system-ui, sans-serif',
    medium: '"Space Grotesk", system-ui, sans-serif',
    character: "Techy",
    sample: "Aa",
  },
  {
    id: "dm-serif",
    label: "DM Serif",
    import: "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap",
    body: '"DM Sans", system-ui, sans-serif',
    editorial: '"DM Serif Display", Georgia, serif',
    medium: '"DM Sans", system-ui, sans-serif',
    character: "Editorial",
    sample: "Aa",
  },
  {
    id: "playfair",
    label: "Playfair",
    import: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500&display=swap",
    body: '"Inter", system-ui, sans-serif',
    editorial: '"Playfair Display", Georgia, serif',
    medium: '"Inter", system-ui, sans-serif',
    character: "Elegant",
    sample: "Aa",
  },
  {
    id: "syne",
    label: "Syne",
    import: "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap",
    body: '"Syne", system-ui, sans-serif',
    editorial: '"Syne", system-ui, sans-serif',
    medium: '"Syne", system-ui, sans-serif',
    character: "Geometric",
    sample: "Aa",
  },
  {
    id: "cabinet",
    label: "Cabinet Grotesk",
    import: "https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800&display=swap",
    body: '"Cabinet Grotesk", system-ui, sans-serif',
    editorial: '"Cabinet Grotesk", system-ui, sans-serif',
    medium: '"Cabinet Grotesk", system-ui, sans-serif',
    character: "Bold",
    sample: "Aa",
  },
];

export const defaultFont = "default";
