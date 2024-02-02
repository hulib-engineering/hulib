// eslint-disable-next-line import/no-extraneous-dependencies
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
    },
    colors: {
      primary: '#0061EF',
      'primary-hover': '#0057D7',
      secondary: '#FFC745',
      light: '#B0CEFA',
      'blue-light': 'var(--foundation-blue-light)',
      'blue-darker': 'var(--foundation-blue-darker)',
      'light-hover': '#D9E7FD',
      white: colors.white,
      black: colors.black,
      slate: colors.slate,
      lime: colors.lime,
      violet: colors.violet,
      amber: colors.amber,
      indigo: colors.indigo,
      red: colors.red,
    },
    extend: {
      colors: {
        gray: {
          100: '#f7fafc',
          200: '#edf2f7',
          300: '#e2e8f0',
          400: '#cbd5e0',
          500: '#a0aec0',
          600: '#718096',
          700: '#4a5568',
          800: '#2d3748',
          900: '#1a202c',
        },
        blue: {
          100: '#ebf8ff',
          200: '#bee3f8',
          300: '#90cdf4',
          400: '#63b3ed',
          500: '#4299e1',
          600: '#3182ce',
          700: '#2b6cb0',
          800: '#2c5282',
          900: '#2a4365',
        },
        slate: {
          1000: '#002254',
        },
        lime: {
          350: '#bbf99e',
        },
        violet: {
          350: '#ccbafe',
        },
        amber: {
          75: '#ffdf8e',
        },
      },
      backgroundImage: {
        'main-pattern': "url('/assets/images/bg-pattern.png')",
      },
      lineClamp: {
        7: '7',
        9: '9',
      },
      content: {
        flash: 'url("/assets/images/flash-vector.svg")',
      },
      keyframes: {
        moveUp: {
          to: { transform: 'translateY(50px)' },
        },
        moveDown: {
          to: { transform: 'translateY(-50px)' },
        },
      },
      animation: {
        'move-up': 'moveUp 2s ease-in infinite alternate-reverse',
        'move-down': 'moveDown 2s ease-in infinite alternate-reverse',
      },
    },
  },
  // eslint-disable-next-line global-require,import/no-extraneous-dependencies
  plugins: [],
};
