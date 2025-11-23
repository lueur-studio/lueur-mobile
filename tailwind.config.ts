import type { Config } from "tailwindcss";

export const textColors = {
  main: "#111827",
  muted: "#6B7280",
  subtle: "#9CA3AF",
  link: "#0A7EA4",
} as const;

export const darkTextColors = {
  main: "#F1F5F9",
  muted: "#FF0000",
  subtle: "#CBD5E1",
  link: "#0A7EA4",
} as const;

const config: Config = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./features/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#6366F1",
          "primary-dark": "#4F46E5",
          "primary-light": "#A5B4FC",
          accent: "#06B6D4",
        },
        status: {
          success: "#22C55E",
          warning: "#F59E0B",
          danger: "#EF4444",
        },
        ui: {
          background: "#FFFFFF",
          "background-subtle": "#F5F7FA",
          surface: "#F9FAFB",
          "surface-hover": "#F3F4F6",
          border: "#E5E7EB",
        },
        text: {
          ...textColors,
        },
        dark: {
          background: "#0F172A",
          surface: "#1E293B",
          border: "#334155",
          text: darkTextColors.main,
          "text-muted": darkTextColors.muted,
          "text-subtle": darkTextColors.subtle,
          "text-link": darkTextColors.link,
        },
      },
    },
  },
  plugins: [],
};

export default config;
