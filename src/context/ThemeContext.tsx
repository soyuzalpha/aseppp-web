"use client";

import React, {
  createContext, useContext, useEffect,
  useState, useCallback, ReactNode,
} from "react";
import { themes, ThemeMode, ThemeColors, defaultTheme, defaultMode, getTheme, Theme } from "@/config/themes";
import { fontPairs, FontPair, defaultFont } from "@/config/fonts";

interface ThemeContextType {
  theme:           string;
  mode:            ThemeMode;
  colors:          ThemeColors;
  availableThemes: Theme[];
  font:            string;
  availableFonts:  FontPair[];
  setTheme:  (theme: string) => void;
  setMode:   (mode: ThemeMode) => void;
  toggleMode: () => void;
  setFont:   (fontId: string) => void;
}

const defaultColors = getTheme(defaultTheme, defaultMode);

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme, mode: defaultMode,
  colors: defaultColors, availableThemes: Object.values(themes),
  font: defaultFont, availableFonts: fontPairs,
  setTheme: () => {}, setMode: () => {}, toggleMode: () => {}, setFont: () => {},
});

/* Inject a <link> tag for a Google Fonts URL (idempotent) */
function injectFontLink(url: string) {
  if (!url) return;
  const id = `gf-${btoa(url).slice(0, 16)}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
}

/* Apply font CSS variables to :root */
function applyFont(pair: FontPair) {
  if (pair.import) injectFontLink(pair.import);
  const root = document.documentElement;
  root.style.setProperty("--font-body",      pair.body);
  root.style.setProperty("--font-editorial", pair.editorial);
  root.style.setProperty("--font-medium",    pair.medium);
  root.style.setProperty("--font-sans",      pair.body);
  root.style.setProperty("--font-display",   pair.editorial);
  // Also update body font directly so Tailwind/inline styles pick it up
  document.body.style.fontFamily = pair.body;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme,   setThemeState] = useState<string>(defaultTheme);
  const [mode,    setModeState]  = useState<ThemeMode>(defaultMode);
  const [font,    setFontState]  = useState<string>(defaultFont);
  const [mounted, setMounted]    = useState(false);
  const [colors,  setColors]     = useState<ThemeColors>(defaultColors);

  /* Hydrate from localStorage */
  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem("theme");
    const storedMode  = localStorage.getItem("mode") as ThemeMode | null;
    const storedFont  = localStorage.getItem("font");

    if (storedTheme && themes[storedTheme]) setThemeState(storedTheme);
    if (storedMode) setModeState(storedMode);
    if (storedFont && fontPairs.find((f) => f.id === storedFont)) setFontState(storedFont);
  }, []);

  /* Apply theme colors */
  useEffect(() => {
    if (!mounted) return;
    const newColors = getTheme(theme, mode);
    setColors(newColors);
    localStorage.setItem("theme", theme);
    localStorage.setItem("mode", mode);
    const root = document.documentElement;
    Object.entries(newColors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    if (mode === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme, mode, mounted]);

  /* Apply font */
  useEffect(() => {
    if (!mounted) return;
    const pair = fontPairs.find((f) => f.id === font) ?? fontPairs[0];
    applyFont(pair);
    localStorage.setItem("font", font);
  }, [font, mounted]);

  const setTheme = useCallback((t: string) => { if (themes[t]) setThemeState(t); }, []);
  const setMode  = useCallback((m: ThemeMode) => setModeState(m), []);
  const toggleMode = useCallback(() => setModeState((p) => (p === "dark" ? "light" : "dark")), []);
  const setFont  = useCallback((id: string) => {
    if (fontPairs.find((f) => f.id === id)) setFontState(id);
  }, []);

  return (
    <ThemeContext.Provider value={{
      theme, mode, colors,
      availableThemes: Object.values(themes),
      font, availableFonts: fontPairs,
      setTheme, setMode, toggleMode, setFont,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
