/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0e1a',
          800: '#111827',
          700: '#1a2035',
          600: '#232b3e',
          500: '#2d3652',
          400: '#3d4766',
          300: '#525f7f',
        },
        brand: {
          green: '#c8f169',
          greenDark: '#a8d44f',
          cyan: '#5ce0d8',
          cyanDark: '#3bbfb8',
          pink: '#e8b4d9',
          pinkDark: '#c994b9',
          lime: '#d4f59a',
        },
        card: {
          green: '#d4e87c',
          cyan: '#5ad4d0',
          pink: '#deb4d4',
          purple: '#b8a4e0',
        },
        surface: {
          dark: '#151b2e',
          mid: '#1e2640',
          light: '#2a3350',
          lighter: '#354060',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      animation: {
        'pulse-ring': 'pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slide-down 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fade-in 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(0.85)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.5' },
          '100%': { transform: 'scale(0.85)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'glow': {
          '0%': { boxShadow: '0 0 20px rgba(200, 241, 105, 0.1)' },
          '100%': { boxShadow: '0 0 30px rgba(200, 241, 105, 0.2)' },
        },
      },
    },
  },
  plugins: [],
};
