const { join } = require("path")
const { createGlobPatternsForDependencies } = require("@nrwl/next/tailwind")

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  presets: [require("../../tailwind-workspace-preset.js")],
  content: [
    join(__dirname, "src/pages/**/*.{js,ts,jsx,tsx}"),
    join(__dirname, "src/components/**/*!(*.stories|*.spec).{ts,tsx}"),
    join(__dirname, "src/layouts/**/*!(*.stories|*.spec).{ts,tsx}"),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontSize: {
        'xs': ['0.65rem', { lineHeight: '0.875rem' }],
        'sm': ['0.75rem', { lineHeight: '1rem' }],
        'base': ['0.8125rem', { lineHeight: '1.25rem' }],
        'lg': ['0.9375rem', { lineHeight: '1.375rem' }],
        'xl': ['1rem', { lineHeight: '1.5rem' }],
        '2xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '3xl': ['1.5rem', { lineHeight: '2rem' }],
        '4xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '5xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        7: "1.75rem",
      },
      zIndex: {
        1: 1,
      },
      keyframes: {
        "notification-enter": {
          "0%": {
            opacity: 0,
            transform: "translateY(20%)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
        "notification-out": {
          "0%": {
            opacity: 1,
            transform: "translateY(0)",
          },
          "100%": {
            opacity: 0,
            transform: "translateY(20%)",
          },
        },
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "tranlate(0px, 0px) scale(1)",
          },
        },
      },
      animation: {
        slideup: "notification-enter 0.4s cubic-bezier(.66,-0.01,.25,1.04)",
        slidedown: "notification-out 0.4s cubic-bezier(.66,-0.01,.25,1.04)",
        blob: "blob 7s infinite",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
}
