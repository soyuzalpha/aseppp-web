"use client";

import React, {
  createContext, useContext, useEffect,
  useState, useCallback, ReactNode,
} from "react";
import { ThemeMode, defaultMode } from "@/config/themes";

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: defaultMode,
  setMode: () => {},
  toggleMode: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(defaultMode);
  const [mounted, setMounted] = useState(false);

  /* Hydrate from localStorage */
  useEffect(() => {
    setMounted(true);
    const storedMode = localStorage.getItem("mode") as ThemeMode | null;
    if (storedMode) setModeState(storedMode);
  }, []);

  /* Apply mode */
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("mode", mode);
    if (mode === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [mode, mounted]);

  const setMode = useCallback((m: ThemeMode) => setModeState(m), []);
  const toggleMode = useCallback(() => setModeState((p) => (p === "dark" ? "light" : "dark")), []);

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
