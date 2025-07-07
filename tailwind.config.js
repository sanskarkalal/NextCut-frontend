/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        secondary: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
        dark: {
          50: "#0f0f0f", // Deeper black background
          100: "#1a1a1a", // Card backgrounds
          150: "#222222", // Slightly lighter for borders
          200: "#2d2d2d", // Interactive elements
          300: "#404040", // Borders and dividers
          400: "#525252", // Muted text
          500: "#737373", // Regular text
          600: "#a3a3a3", // Emphasized text
          700: "#d4d4d4", // High contrast text
          800: "#f5f5f5", // Primary text (white-ish)
          900: "#ffffff", // Pure white for highest contrast
        },
        accent: {
          purple: "#8b5cf6",
          pink: "#ec4899",
          cyan: "#06b6d4",
          emerald: "#10b981",
          amber: "#f59e0b",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "theme-switch": "themeSwitch 0.3s ease-in-out",
        glow: "glow 2s ease-in-out infinite alternate",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        themeSwitch: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(180deg)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(59, 130, 246, 0.5)" },
          "100%": {
            boxShadow:
              "0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6)",
          },
        },
      },
      boxShadow: {
        "glow-blue": "0 0 20px rgba(59, 130, 246, 0.6)",
        "glow-purple": "0 0 20px rgba(139, 92, 246, 0.6)",
        "glow-pink": "0 0 20px rgba(236, 72, 153, 0.6)",
        "dark-lg":
          "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
        "dark-xl":
          "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [],
};
