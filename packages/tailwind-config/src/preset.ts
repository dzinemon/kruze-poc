import type { Config } from "tailwindcss";

const preset: Partial<Config> = {
  theme: {
    extend: {
      // ─── Colors ──────────────────────────────────────────────────────────
      colors: {
        // Brand Blue — primary
        brand: {
          50: "#f0f7ff",
          100: "#dceeff",
          200: "#b2d9ff",
          300: "#75baff",
          400: "#3d91e8",
          500: "#2f74b2", // PRIMARY
          600: "#245d92",
          700: "#1a4872",
          800: "#024d7c", // PRIMARY DARK
          900: "#013a5e",
          950: "#01253d",
        },

        // Cyan — accent (decorative only; accent-500 fails WCAG AA on white)
        accent: {
          50: "#ecfcff",
          100: "#d0f5fe",
          200: "#a5eafd",
          300: "#67d9fb",
          400: "#22bef0",
          500: "#02abe3", // ACCENT PRIMARY
          600: "#0287b8",
          700: "#056a94", // minimum for WCAG AA on white
        },

        // Neutral — slate-blue tinted (replaces Bootstrap grays)
        neutral: {
          0: "#ffffff",
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },

        // Status — for feedback states only, not decoration
        success: { light: "#dcfce7", DEFAULT: "#22c55e", dark: "#15803d" },
        warning: { light: "#fef9c3", DEFAULT: "#eab308", dark: "#a16207" },
        danger:  { light: "#fee2e2", DEFAULT: "#ef4444", dark: "#b91c1c" },
        info:    { light: "#ecfcff", DEFAULT: "#02abe3", dark: "#0369a1" },

        // Semantic tokens — CSS vars ensure dark mode auto-switches
        "bg-base":     "var(--color-bg-base)",
        "bg-subtle":   "var(--color-bg-subtle)",
        "bg-muted":    "var(--color-bg-muted)",
        "bg-emphasis": "var(--color-bg-emphasis)",

        "border-subtle":  "var(--color-border-subtle)",
        "border-default": "var(--color-border-default)",
        "border-strong":  "var(--color-border-strong)",
        "border-brand":   "var(--color-border-brand)",
        "border-accent":  "var(--color-border-accent)",

        "text-primary":   "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-muted":     "var(--color-text-muted)",
        "text-disabled":  "var(--color-text-disabled)",
        "text-inverse":   "var(--color-text-inverse)",
        "text-brand":     "var(--color-text-brand)",
        "text-accent":    "var(--color-text-accent)",

        "interactive-default": "var(--color-interactive-default)",
        "interactive-hover":   "var(--color-interactive-hover)",
        "interactive-active":  "var(--color-interactive-active)",
        "interactive-focus":   "var(--color-interactive-focus)",
      },

      // ─── Typography ───────────────────────────────────────────────────────
      // Lato — 4 weights only: 300, 400, 700, 900 (self-hosted woff2)
      // font-semibold (600) and font-medium (500) do NOT exist in Lato.
      fontFamily: {
        sans: ["Lato", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "Cascadia Code", "monospace"],
      },

      // ─── Border Radius — Geometric System ────────────────────────────────
      borderRadius: {
        xs:       "0.25rem",  //  4px — badges, tight chips
        sm:       "0.5rem",   //  8px — inputs, textarea, alerts
        md:       "0.75rem",  // 12px — cards, dropdowns, popovers
        lg:       "1rem",     // 16px — panels, modals
        xl:       "1.25rem",  // 20px — large feature cards
        "2xl":    "1.5rem",   // 24px — hero cards, large containers
        squircle: "28%",      // icon containers / avatars — equal-dimension only
      },

      // ─── Shadows — brand-tinted, layered ─────────────────────────────────
      boxShadow: {
        xs: "0 1px 2px rgba(15, 23, 42, 0.05)",
        sm: "0 1px 2px rgba(15, 23, 42, 0.04), 0 2px 4px rgba(47, 116, 178, 0.06)",
        md: "0 2px 4px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(47, 116, 178, 0.08), 0 12px 24px rgba(47, 116, 178, 0.04)",
        lg: "0 4px 8px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(47, 116, 178, 0.10), 0 24px 48px rgba(47, 116, 178, 0.06)",
        xl: "0 8px 16px rgba(15, 23, 42, 0.05), 0 16px 40px rgba(47, 116, 178, 0.12), 0 40px 80px rgba(47, 116, 178, 0.07)",
        // Glow variants — CTAs, interactive highlights
        brand:             "0 0 0 1px rgba(47, 116, 178, 0.12), 0 4px 24px rgba(47, 116, 178, 0.28)",
        accent:            "0 0 0 1px rgba(2, 171, 227, 0.12), 0 4px 24px rgba(2, 171, 227, 0.22)",
        "focus-ring":      "0 0 0 3px rgba(47, 116, 178, 0.35)",
        "focus-ring-accent": "0 0 0 3px rgba(2, 171, 227, 0.30)",
        inner:             "inset 0 2px 4px rgba(15, 23, 42, 0.06)",
      },
    },
  },
};

export default preset;
