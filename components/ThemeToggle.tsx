"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

/**
 * Hell/Dunkel-Umschalter. Standard folgt der Geräte-Einstellung
 * (im Inline-Script in layout.tsx gesetzt); ein Klick überschreibt und merkt
 * sich die Wahl in localStorage.
 */
export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* ignore */
    }
    setDark(next);
  }

  return (
    <button
      onClick={toggle}
      aria-label="Hell/Dunkel umschalten"
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-elevate hover:text-foreground"
    >
      {/* Vor dem Mounten neutrales Icon (Mond), um Layout-Shift zu vermeiden */}
      {dark === false ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
