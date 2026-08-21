/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        taazaa: {
          50: '#fff5f0',
          100: '#ffe8de',
          200: '#ffd3bf',
          300: '#ffb394',
          400: '#ff8659',
          500: '#FF5B22', // Official Taazaa Vibrant Coral-Orange
          600: '#e54510',
          700: '#bf3308',
          800: '#992a0a',
          900: '#7c250c',
          accent: '#29E8AE', // Taazaa Cyan / Mint Highlight
        },
        navy: {
          700: '#1a1f4b',
          800: '#0d1136',
          900: '#07091E', // Official Taazaa Deep Dark Theme Base
          950: '#040512',
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
