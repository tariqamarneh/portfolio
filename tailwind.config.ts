import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'laptop': '1024px',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          950: '#0c0a08',
          900: '#141110',
          800: '#1c1815',
          700: '#2a2420',
          600: '#3a322c',
          500: '#5a4e44',
          400: '#857669',
          300: '#b5a798',
          200: '#d9ccbc',
          100: '#f5ece0',
        },
        ember: {
          50:  '#fff4ec',
          100: '#ffe4d1',
          200: '#ffc499',
          300: '#ff9d5c',
          400: '#ff7a34',
          500: '#ff6b2b',
          600: '#e8521a',
          700: '#bc3f13',
          800: '#8f3010',
          900: '#5f1f08',
        },
        sage: {
          400: '#9bc5a6',
          500: '#6fa880',
        },
        paper: {
          50:  '#fbf7ef',
          100: '#f5ede0',
          200: '#e8dcc6',
          300: '#d4c19c',
        },
        /* Remap legacy cyan/violet/fuchsia across untouched sections to the ember palette
           so gradients/accents read as cohesive without touching every component. */
        cyan: {
          300: '#ffc499',
          400: '#ff9d5c',
          500: '#ff7a34',
          600: '#ff6b2b',
          700: '#e8521a',
        },
        violet: {
          400: '#ff7a34',
          500: '#e8521a',
          600: '#bc3f13',
          700: '#8f3010',
        },
        fuchsia: {
          300: '#ffb88a',
          400: '#ff9d5c',
          500: '#ff6b2b',
          600: '#bc3f13',
        },
      },
      animation: {
        'gradient': 'gradient 8s ease infinite',
        'marquee': 'marquee 40s linear infinite',
        'marquee-slow': 'marquee 80s linear infinite',
        'shimmer': 'shimmer 3s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
export default config;