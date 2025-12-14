/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ihub: {
          DEFAULT: '#0ea5a4',
        }
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'wiggle-quick': {
          '0%,100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'fade-in-up': 'fade-in-up .45s ease-out both',
        'wiggle-quick': 'wiggle-quick .8s ease-in-out',
      },
      boxShadow: {
        'soft-lg': '0 10px 30px rgba(16,24,40,0.08)',
      },
      transitionProperty: {
        'height-opacity': 'height, opacity',
      }
    }
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
