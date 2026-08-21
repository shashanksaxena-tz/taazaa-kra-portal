/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Taazaa Official Mint / Emerald Signature Accent (from taazaa.com logo)
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#29E8AE', // Taazaa Official Logo Mint
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22',
        },
        // Taazaa Deep Midnight Navy & Surface Tones (from taazaa.com dark mode)
        midnight: {
          950: '#07091E', // Official Taazaa Hero/Footer Navy
          900: '#0B0F2A',
          850: '#0F1538',
          800: '#141A46',
          700: '#1F265E',
        },
        accent: {
          mint: '#29E8AE',
          cyan: '#06B6D4',
          emerald: '#10B981',
          indigo: '#6366F1',
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
}
