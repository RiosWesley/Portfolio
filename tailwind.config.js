/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
        serif: ['Lora', 'serif'],
      },
      colors: {
        'dark-bg': '#0a041a',
        'light-text': '#e0e0e0',
        'heading': '#ffffff',
        'primary': '#8a2be2',
        'primary-light': '#a78bfa',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'scroll-tech': 'scrollTech 20s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scrollTech: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};

