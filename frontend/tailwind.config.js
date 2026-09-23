/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      colors: {
        brand: {
          bg:        "var(--bg)",
          secondary: "var(--bg-secondary)",
          card:      "var(--bg-card)",
          code:      "var(--bg-code)",
          nav:       "var(--bg-nav)",
          footer:    "var(--bg-footer)",
          input:     "var(--bg-input)",
        },
        announce:    "var(--announce)",
        accent: {
          DEFAULT:   "var(--accent)",
          hover:     "var(--accent-hover)",
        },
        txt: {
          DEFAULT:   "var(--text)",
          dim:       "var(--text-dim)",
          inverse:   "var(--text-inverse)",
        },
        link: {
          DEFAULT:   "var(--link)",
          hover:     "var(--link-hover)",
        },
        border: {
          DEFAULT:   "var(--border)",
          hover:     "var(--border-hover)",
        },
      },
    },
  },
  plugins: [],
};
