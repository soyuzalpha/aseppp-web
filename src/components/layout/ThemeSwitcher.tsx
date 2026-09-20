"use client";

import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";

export default function ThemeSwitcher() {
  const { mode, toggleMode } = useTheme();

  return (
    <button
      onClick={toggleMode}
      aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        color: "var(--color-foreground)",
        background: "none",
        border: "1px solid var(--color-border)",
        borderRadius: "2px",
        padding: "5px 7px",
        display: "inline-flex",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      {mode === "dark" ? <Sun size={14} strokeWidth={1.5} /> : <Moon size={14} strokeWidth={1.5} />}
    </button>
  );
}
