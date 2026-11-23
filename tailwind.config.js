/** Colours are the W&B Brand Guidelines 2.0 core palette, tints and shades (pp. 11–12).
 *  The website uses the Signal colourway (p. 13): Navy dominant, Signal accent, Blue for links.
 *  Rules kept in code: navy text on Signal/Amber, Signal text on Navy; never white on Signal or Ember,
 *  never Signal text on white. */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 100: '#E7EBF4', 300: '#8D9CC0', 500: '#2A4C8F', 700: '#16274F', 900: '#0B1427', DEFAULT: '#16274F' },
        blue: { 100: '#E2EEFB', 300: '#7DB0E8', 500: '#1462BA', 700: '#0E4B91', 900: '#072C57', DEFAULT: '#1462BA' },
        signal: { 100: '#DCF7FA', 300: '#7EE0EC', 500: '#1FC0D4', 700: '#00788A', 900: '#003F49', DEFAULT: '#1FC0D4' },
        amber: { 100: '#FFF2D4', 300: '#FFD27D', 500: '#F5A524', 700: '#9A6100', 900: '#5C3A00', DEFAULT: '#F5A524' },
        ember: { 100: '#FFE5D8', 300: '#FFA274', 500: '#F26A21', 700: '#C4410C', 900: '#6E2405', DEFAULT: '#F26A21' },
        graphite: { 100: '#EEF2F6', 300: '#C3CAD6', 500: '#7D899E', 700: '#3C475C', 900: '#1B2230', DEFAULT: '#3C475C' },
        cobalt: '#00399F',
        carbon: '#1B2230',
        ink: { DEFAULT: '#1B2230', muted: '#3C475C' },
        line: '#D9DFE8',
        /* aliases used by the 3D viewer chrome carried over from the showroom build */
        paper: '#FFFFFF',
        steel: { line: '#D9DFE8' },
      },
      fontFamily: {
        display: ['"Barlow Semi Condensed"', '"Arial Narrow"', '"Noto Sans Arabic"', '"Noto Kufi Arabic"', '"Geeza Pro"', 'Tahoma', '"Hiragino Kaku Gothic ProN"', '"Hiragino Sans"', '"Yu Gothic"', 'Meiryo', '"Noto Sans JP"', '"Noto Sans CJK JP"', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Arial', '"Noto Sans Arabic"', '"Noto Kufi Arabic"', '"Geeza Pro"', 'Tahoma', '"Hiragino Kaku Gothic ProN"', '"Hiragino Sans"', '"Yu Gothic"', 'Meiryo', '"Noto Sans JP"', '"Noto Sans CJK JP"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', '"Noto Sans Arabic"', '"Noto Kufi Arabic"', '"Geeza Pro"', 'Tahoma', '"Hiragino Kaku Gothic ProN"', '"Hiragino Sans"', '"Yu Gothic"', 'Meiryo', '"Noto Sans JP"', '"Noto Sans CJK JP"', 'monospace'],
      },
      borderRadius: { sm: '2px', DEFAULT: '4px', md: '6px' },
      boxShadow: {
        panel: '0 1px 2px rgb(11 20 39 / 0.06), 0 16px 40px -16px rgb(11 20 39 / 0.28)',
        lift: '0 1px 2px rgb(11 20 39 / 0.06), 0 12px 32px -12px rgb(11 20 39 / 0.2)',
        card: '0 1px 2px rgb(11 20 39 / 0.05), 0 8px 24px -14px rgb(11 20 39 / 0.22)',
      },
      maxWidth: { page: '1360px' },
      fontSize: { small: ['0.875rem', '1.4'] },
      screens: { xs: '420px' },
    },
  },
  plugins: [],
}
