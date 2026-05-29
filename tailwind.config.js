/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1E2761',
          50: '#EEF0F9',
          100: '#D6DAF0',
          200: '#AEB6E0',
          600: '#2A3582',
          700: '#1E2761',
          800: '#171D4A',
          900: '#0F1333',
        },
        accent: {
          DEFAULT: '#02C39A',
          light: '#34D7B5',
          dark: '#019A79',
        },
        canvas: '#F7F8FA',
        positive: '#16A34A',
        neutral: '#F59E0B',
        negative: '#DC2626',
        ink: {
          900: '#0F172A',
          600: '#475569',
          400: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)',
        card: '0 4px 16px rgba(15,23,42,0.06)',
        lift: '0 10px 30px rgba(15,23,42,0.10)',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.4, transform: 'scale(0.85)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        pulseDot: 'pulseDot 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
