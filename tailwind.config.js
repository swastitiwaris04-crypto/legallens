/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        cream: {
          50: '#FDFBF6',
          100: '#F5F2EA',
          200: '#EDE9DF',
        },
        forest: {
          50: '#E8F0E0',
          500: '#2D5016',
          600: '#3D6B20',
          900: '#1A2E0A',
        }
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        shimmer: 'shimmer 1.5s infinite',
        marquee: 'marquee 25s linear infinite',
        'spin-slow': 'spin 2s linear infinite',
        'bounce-dot': 'bounceDot 1.4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(1deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        bounceDot: {
          '0%, 80%, 100%': { transform: 'scale(0)', opacity: '0' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        }
      }
    }
  },
  plugins: [],
};
