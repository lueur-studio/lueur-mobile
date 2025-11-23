import type { Config } from "tailwindcss";

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
          main: "#111827",
          muted: "#6B7280",
          subtle: "#9CA3AF",
        },
        dark: {
          background: "#0F172A",
          surface: "#1E293B",
          border: "#334155",
          text: "#F1F5F9",
          "text-muted": "#94A3B8",
        },
      },
    },
  },
  plugins: [],
};

export default config;
