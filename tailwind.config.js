/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0c0a09",
        paper: "#f7f4ea",
        "paper-aged": "#ede5ce",
        "scootch-orange": "#ea580c",
        "retro-red": "#dc2626",
        "retro-blue": "#1e3a8a",
        "retro-gold": "#b45309",
        "tape-plastic": "#18181b",
        "tape-hub": "#f4f4f5",
        "amber-led": "#f59e0b",
        "lcd-cyan": "#38bdf8",
      },
      fontFamily: {
        display: ['"Covered By Your Grace"', '"Permanent Marker"', 'cursive'],
        marker: ['"Permanent Marker"', 'cursive'],
        handwritten: ['"Caveat"', '"Patrick Hand"', '"Covered By Your Grace"', 'cursive'],
        slater: ['"Walter Turncoat"', '"Permanent Marker"', 'cursive'],
        lcd: ['"VT323"', '"Space Mono"', 'monospace'],
        mono: ['"Space Mono"', 'monospace'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'tape': '0 20px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08) inset',
        'jcard': '0 15px 35px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.2)',
        'rack-spine': '0 4px 12px rgba(0,0,0,0.4)',
        'glow-amber': '0 0 15px rgba(245, 158, 11, 0.75)',
        'glow-cyan': '0 0 12px rgba(56, 189, 248, 0.6)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'spin-fast': 'spin 0.6s linear infinite',
        'spin-rewind': 'spin-reverse 0.6s linear infinite',
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' }
        }
      }
    },
  },
  plugins: [],
}
