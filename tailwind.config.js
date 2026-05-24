/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ─── COLORES CENTRALIZADOS ───────────────────────────────────────────
      colors: {
        'brand-black':      '#000000',
        'brand-white':      '#FFFFFF',
        'brand-gray':       '#888888',
        'brand-gray-light': '#CCCCCC',
        'brand-gray-dark':  '#1A1A1A',
      },
      // ─── TIPOGRAFÍAS CENTRALIZADAS ───────────────────────────────────────
      fontFamily: {
        poem: ['var(--font-poem)', 'Georgia', 'serif'],
        ui:   ['var(--font-ui)',   'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
