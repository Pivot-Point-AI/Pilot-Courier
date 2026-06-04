/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4ff',
          100: '#dbe4ff',
          200: '#bac8ff',
          300: '#91a7ff',
          400: '#748ffc',
          500: '#5c7cfa',
          600: '#4c6ef5',
          700: '#4263eb',
          800: '#3b5bdb',
          900: '#364fc7',
          950: '#0c2461',
        },
        brand: {
          orange: '#f97316',
          'orange-dark': '#ea6c10',
          'orange-light': '#fdba74',
          navy: '#0c2461',
          'navy-mid': '#1e3a8a',
          'navy-light': '#1d4ed8',
        },
      },
      fontFamily: {
        // Inter as the default sans / body font — matches layout.tsx font-body class
        sans:    ['var(--font-inter)', 'sans-serif'],
        body:    ['var(--font-inter)', 'sans-serif'],
        inter:   ['var(--font-inter)', 'sans-serif'],
        // Syne for display / headings
        display: ['var(--font-syne)', 'serif'],
        syne:    ['var(--font-syne)', 'serif'],
        // Monospace
        mono:    ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'hero-gradient':   'linear-gradient(135deg, #0c2461 0%, #1e3a8a 40%, #1d4ed8 100%)',
        'orange-gradient': 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        'card-gradient':   'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
      },
      boxShadow: {
        'card':       '0 4px 24px rgba(12, 36, 97, 0.08)',
        'card-hover': '0 8px 40px rgba(12, 36, 97, 0.15)',
        'orange':     '0 4px 20px rgba(249, 115, 22, 0.4)',
        'orange-lg':  '0 8px 32px rgba(249, 115, 22, 0.5)',
      },
      animation: {
        'fade-up':      'fadeUp 0.6s ease-out forwards',
        'fade-in':      'fadeIn 0.4s ease-out forwards',
        'slide-in-left':'slideInLeft 0.5s ease-out forwards',
        'float':        'float 3s ease-in-out infinite',
        'pulse-slow':   'pulse 3s ease-in-out infinite',
        'spin-slow':    'spin 8s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};