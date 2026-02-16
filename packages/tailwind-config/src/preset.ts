import type { Config } from "tailwindcss";

const preset: Partial<Config> = {
  theme: {
    extend: {
      // Brand colors — flat namespace: text-primary, bg-info, border-muted, etc.
      // Source: _assets/sass/styles/color.scss + project-vars.scss
      colors: {
        primary: {
          DEFAULT: "#2F74B2",
          dark: "#024D7C",
        },
        info: "#02ABE3",
        body: "#434344",
        secondary: "#59595b",
        muted: "#9B9B9B",
        success: "#4cae4c",
        warning: "#F0AD4E",
        danger: "#D9534F",
        chart: {
          blue: "#4791CE",
          gray: "#9B9B9B",
          orange: "#fd7e14",
          yellow: "#ffc107",
          teal: "#20c997",
          indigo: "#6610f2",
        },
      },

      // Font family — Lato as primary sans
      fontFamily: {
        sans: [
          "Lato",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },

      // Extra font weights beyond Tailwind defaults
      fontWeight: {
        black: "900",
      },

      // Button-specific border radius
      borderRadius: {
        btn: "26px",
        "btn-sm": "24px",
        "btn-lg": "30px",
      },

      // Container widths matching current site
      maxWidth: {
        "container-sm": "540px",
        "container-md": "720px",
        "container-lg": "960px",
        "container-xl": "1140px",
      },
    },
  },
};

export default preset;
