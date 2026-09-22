/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      colors: {
        brand: {
          bg:        "var(--bg)",
          secondary: "var(--bg-secondary)",
          code:      "var(--bg-code)",
          nav:       "var(--bg-nav)",
          footer:    "var(--bg-footer)",
        },
        announce:    "var(--announce)",
        accent:      "var(--accent)",
        txt: {
          DEFAULT:   "var(--text)",
          dim:       "var(--text-dim)",
          inverse:   "var(--text-inverse)",
        },
        link:        "var(--link)",
        border:      "var(--border)",
      },
    },
  },
  plugins: [],
};
