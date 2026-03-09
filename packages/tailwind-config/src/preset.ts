import type { Config } from "tailwindcss";

// All design tokens (colors, shadows, radii, gradients, spacing) are defined
// in tokens.css via Tailwind v4 @theme — they auto-generate utility classes
// without any config here. This preset is intentionally minimal.
//
// The apps use:
//   @import "tailwindcss";
//   @import "../../../../tokens.css";   ← @theme block = single source of truth
//   @custom-variant dark (&:where(.dark, .dark *));
//
// Content paths live in each app's tailwind.config.ts, not here.

const preset: Partial<Config> = {};

export default preset;
