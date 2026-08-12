/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Core brand palette — deep navy + electric teal accent
        surface: {
          950: '#050b14',
          900: '#090f1a',
          800: '#0d1624',
          700: '#121e30',
          600: '#1a2a40',
          500: '#243550',
        },
        accent: {
          DEFAULT: '#00d4ff',
          50:  '#e0faff',
          100: '#b3f3ff',
          200: '#7dedff',
          300: '#3de5ff',
          400: '#00d4ff',
          500: '#00b8e0',
          600: '#0094b5',
          700: '#006f88',
          800: '#004f61',
          900: '#002f3a',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger:  '#ef4444',
        critical: '#dc2626',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)",
        'hero-glow': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,212,255,0.15), transparent)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(0,212,255,0.15)',
        'glow':    '0 0 20px rgba(0,212,255,0.2)',
        'glow-lg': '0 0 40px rgba(0,212,255,0.25)',
        'inner-glow': 'inset 0 1px 0 rgba(0,212,255,0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-up': 'slideInUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'ping-once': 'ping 1s cubic-bezier(0,0,0.2,1) 1',
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        slideInUp: {
          '0%': { transform: 'translateY(16px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      borderRadius: {
        'xl2': '1rem',
        'xl3': '1.5rem',
      },
    },
  },
  plugins: [],
};
