module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        primary: "var(--color-primary)",
        "primary-foreground": "var(--color-primaryForeground)",
        secondary: "var(--color-secondary)",
        "secondary-foreground": "var(--color-secondaryForeground)",
        muted: "var(--color-muted)",
        "muted-foreground": "var(--color-mutedForeground)",
        accent: "var(--color-accent)",
        "accent-foreground": "var(--color-accentForeground)",
        border: "var(--color-border)",
        card: "var(--color-card)",
        "card-foreground": "var(--color-cardForeground)",
        ring: "var(--color-ring)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
