"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  }

  return (
    <button
      onClick={toggle}
      className="icon-container icon-container-md squircle bg-muted hover:bg-emphasis text-primary transition-fast focus-ring cursor-pointer"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun width={18} height={18} strokeWidth={1.5} aria-hidden="true" />
      ) : (
        <Moon width={18} height={18} strokeWidth={1.5} aria-hidden="true" />
      )}
    </button>
  );
}
