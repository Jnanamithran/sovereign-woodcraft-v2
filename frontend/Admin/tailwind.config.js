/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Botanical Garden Color Palette (Admin version)
        botanical: {
          dark: '#1a3a1a',      // Deep forest green
          primary: '#2D5A27',   // Rich green
          medium: '#4a7c59',    // Medium green
          light: '#8fbc8f',     // Soft green
          pale: '#F0F4F0',      // Very light green/white
          cream: '#faf8f5',     // Warm cream
          earth: '#8b6914',     // Earthy gold
          bark: '#5d4037',      // Brown accent
          sage: '#9caf88',      // Sage green
          moss: '#6b8e23',      // Moss green
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      },
      fontFamily: {
        // Serif for headings (elegant, botanical feel)
        serif: ['Playfair Display', 'Georgia', 'serif'],
        // Sans-serif for body text (clean, modern)
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // Monospace for accents
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        // Organic shapes - more rounded
        'organic-sm': '8px',
        'organic': '16px',
        'organic-lg': '24px',
        'organic-xl': '32px',
        'organic-full': '9999px',
      },
      boxShadow: {
        // Soft, natural shadows
        'soft': '0 4px 20px -2px rgba(45, 90, 39, 0.1)',
        'soft-lg': '0 10px 40px -4px rgba(45, 90, 39, 0.15)',
        'glow': '0 0 20px rgba(143, 188, 143, 0.3)',
      },
      animation: {
        'grow': 'grow 0.8s ease-out forwards',
        'sway': 'sway 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
      },
      keyframes: {
        grow: {
          '0%': { transform: 'scaleY(0)', opacity: '0' },
          '100%': { transform: 'scaleY(1)', opacity: '1' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}