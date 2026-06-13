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
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        /* Deep-space canvas — cool near-black blues */
        abyss: {
          950: '#04070d',
          900: '#070d18',
          800: '#0d1524',
          700: '#182236',
          600: '#24314c',
          500: '#3b4a6b',
          400: '#64769b',
          300: '#93a3c2',
          200: '#bfcbe2',
          100: '#e2e9f5',
          50:  '#f2f6fc',
        },
        /* Primary accent — luminous teal */
        lumen: {
          50:  '#effefb',
          100: '#d4faf3',
          200: '#a8f2e6',
          300: '#76e9d8',
          400: '#4cdcca',
          500: '#2fc9b9',
          600: '#1da99d',
          700: '#198280',
          800: '#176665',
          900: '#14504f',
        },
        /* Whisper accent — nebula indigo, used very sparingly */
        haze: {
          300: '#a8b4fa',
          400: '#7c8cf8',
          500: '#5c6cf0',
          600: '#4853d4',
        },
        /* Legacy palette remaps — untouched components (admin, command palette,
           pull-to-contact) keep compiling and automatically adopt the new hues. */
        ink: {
          950: '#04070d',
          900: '#070d18',
          800: '#0d1524',
          700: '#182236',
          600: '#24314c',
          500: '#3b4a6b',
          400: '#64769b',
          300: '#93a3c2',
          200: '#bfcbe2',
          100: '#e2e9f5',
          50:  '#f2f6fc',
        },
        ember: {
          50:  '#effefb',
          100: '#d4faf3',
          200: '#a8f2e6',
          300: '#76e9d8',
          400: '#4cdcca',
          500: '#2fc9b9',
          600: '#1da99d',
          700: '#198280',
          800: '#176665',
          900: '#14504f',
        },
        paper: {
          50:  '#f2f6fc',
          100: '#e2e9f5',
          200: '#bfcbe2',
          300: '#93a3c2',
        },
        sage: {
          400: '#7ddba8',
          500: '#4cbd86',
        },
        cyan: {
          300: '#76e9d8',
          400: '#4cdcca',
          500: '#2fc9b9',
          600: '#1da99d',
          700: '#198280',
        },
        violet: {
          400: '#7c8cf8',
          500: '#5c6cf0',
          600: '#4853d4',
          700: '#3a42a8',
        },
        fuchsia: {
          300: '#a8b4fa',
          400: '#7c8cf8',
          500: '#5c6cf0',
          600: '#4853d4',
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
