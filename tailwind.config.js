// eslint-disable-next-line import/no-extraneous-dependencies
const colors = require('tailwindcss/colors');
// eslint-disable-next-line import/no-extraneous-dependencies
const plugin = require('tailwindcss');

const backfaceVisibility = plugin(function ({ addUtilities }) {
  addUtilities({
    '.backface-visible': {
      'backface-visibility': 'visible',
    },
    '.backface-hidden': {
      'backface-visibility': 'hidden',
    },
  });
});

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xxl: '1280px',
    },
    data: {
      checked: 'ui~="checked"',
    },
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
      'blue-light-active': 'var(--foundation-blue-light-active)',
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
      neutral: colors.neutral,
      transparent: 'transparent',
      green: colors.green,
    },
    extend: {
      maxWidth: {
        'screen-xxl': '1440px',
      },
      colors: {
        gray: {
          100: '#c8c8c8',
          150: '#eaeaea',
          200: '#edf2f7',
          300: '#e2e8f0',
          400: '#727272',
          500: '#4f4f4f',
          600: '#718096',
          700: '#4a5568',
          800: '#2b2b2b',
          900: '#1a202c',
        },
        blue: {
          100: '#ebf8ff',
          200: '#bee3f8',
          250: '#a8d5fe',
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
        yellow: {
          90: '#FDF3CE',
        },
        neutral: {
          10: '#171819',
          20: '#2E3032',
          30: '#45484A',
          40: '#5C6063',
          60: '#8F9397',
          70: '#ABAEB1',
          80: '#C7C9CB',
          90: '#E3E4E5',
          98: '#F9F9F9',
          variant: {
            98: '#F3F4F6',
          },
        },
        primary: {
          10: '#010D26',
          20: '#021A4C',
          30: '#022873',
          40: '#033599',
          50: '#0442BF',
          60: '#0858FA',
          80: '#84ACFC',
          90: '#CDDDFE',
          98: '#F0F5FF',
        },
        red: {
          50: '#EE0038',
        },
        pink: {
          90: '#FFE4F1',
        },
        green: {
          50: '#46D51B',
          98: '#FBFEFA',
        },
        // lp: only for Landing Page
        lp: {
          'primary-blue': '#0061EF',
        },
      },
      rotate: {
        30: '30deg',
        60: '60deg',
        120: '120deg',
        150: '150deg',
        210: '210deg',
        240: '240deg',
        270: '270deg',
        300: '300deg',
        330: '330deg',
      },
      backgroundImage: {
        'main-pattern': "url('/assets/images/bg-pattern.png')",
        'special-section-pattern':
          "url('/assets/images/bg-special-pattern.webp')",
        'radial-gradient':
          'radial-gradient(at 52% 57%, hsla(11,83%,72%,1) 0px, transparent 50%), radial-gradient(at 37% 57%, hsla(175,78%,66%,1) 0px, transparent 50%)',
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
        slide: {
          '0%': {
            transform: 'translateX(0%)',
          },
          '100%': {
            transform: 'translateX(-100%)',
          },
        },
        displayMessage: {
          '0%': {
            opacity: '0',
            marginTop: '0px',
          },
          '100%': {
            opacity: '1',
            marginTop: '-200px',
          },
        },
        changeToPrimary: {
          '0%': {
            color: '#FFFFFF',
          },
          '100%': {
            color: 'var(--foundation-blue-normal)',
          },
        },
        changeToSecondary: {
          '0%': {
            color: '#FFFFFF',
          },
          '100%': {
            color: '#B276DC',
          },
        },
        changeToOrange: {
          '0%': {
            color: '#FFFFFF',
          },
          '100%': {
            color: '#FF8207',
          },
        },
        changeToYellow: {
          '0%': {
            color: '#FFFFFF',
          },
          '100%': {
            color: 'var(--foundation-yellow-normal)',
          },
        },
        moveUpOld: {
          '0%': {
            top: '50%',
          },
          '100%': {
            top: '-100%',
          },
        },
        dropNew: {
          '0%': {
            right: '0%',
          },
          '66.6666%': {
            right: '50%',
            marginRight: '-300px',
          },
          '90%': {
            right: '50%',
            marginRight: '-300px',
          },
          '100%': {
            right: '50%',
            color: 'var(--foundation-blue-normal)',
          },
        },
        float: {
          '0%': {
            right: '0%',
          },
          '40%': {
            right: '50%',
            marginRight: '-300px',
          },
          '50%': {
            right: '50%',
            marginRight: '-200px',
            top: '50%',
          },
          '100%': {
            right: '50%',
            top: '-100%',
          },
        },
        showFirework: {
          '0%': {
            marginTop: '100%',
            opacity: '0',
            width: '2px',
            height: '30px',
            display: 'block',
            borderRadius: '50%',
          },
          '75%': {
            marginTop: '0%',
            opacity: '1',
            width: '2px',
            height: '30px',
            display: 'block',
            borderRadius: '50%',
          },
          '80%': {
            marginTop: '0px',
            marginLeft: '0px',
            opacity: '1',
            width: '10px',
            height: '10px',
            display: 'block',
            borderRadius: '50%',
            transform: 'scale(0.2)',
          },
          '100%': {
            opacity: '1',
            width: '10px',
            height: '10px',
            display: 'block',
            borderRadius: '50%',
            transform: 'scale(1)',
          },
        },
        fire: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        transformFromOldToNew: {
          '0%': {
            transform: 'rotate(-30deg)',
            width: '40px',
          },
          '100%': {
            transform: 'rotate(-150deg)',
            width: '70px',
          },
        },
        loaderCircleJumping: {
          '0%, 50%, 100%': { transform: 'translateY(0px)' },
          '25%': { transform: 'translateY(-15px) scale(0.5)' },
          '75%': { transform: 'translateY(5px) scale(0.9)' },
        },
        rotation: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        gradientAnimation: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        borderCrawling: {
          from: {
            transform: 'rotate(0deg)',
          },
          to: {
            transform: 'rotate(360deg)',
          },
        },
        blobBounce: {
          '0%': {
            transform: 'translate(-100%, -100%) translate3d(0, 0, 0)',
          },

          '25%': {
            transform: 'translate(-100%, -100%) translate3d(100%, 0, 0)',
          },

          '50%': {
            transform: 'translate(-100%, -100%) translate3d(100%, 100%, 0)',
          },

          '75%': {
            transform: 'translate(-100%, -100%) translate3d(0, 100%, 0)',
          },

          '100%': {
            transform: 'translate(-100%, -100%) translate3d(0, 0, 0)',
          },
        },
        glider: {
          '0%': {
            transform: 'rotate(5deg) translateX(-200%)',
          },
          '100%': {
            transform: 'rotate(5deg) translateX(1920px)',
          },
        },
        flash: {
          '100%': {
            backgroundPosition: '-100% 0',
          },
        },
      },
      animation: {
        'move-up': 'moveUp 2s ease-in infinite alternate-reverse',
        'move-down': 'moveDown 2s ease-in infinite alternate-reverse',
        slide: 'slide 10s infinite linear',
        'display-message': 'displayMessage 2s ease-in-out 7s forwards',
        'change-to-primary': 'changeToPrimary 2s ease-in-out 5.75s forwards',
        'change-to-secondary':
          'changeToSecondary 2s ease-in-out 5.75s forwards',
        'change-to-orange': 'changeToOrange 2s ease-in-out 5.75s forwards',
        'change-to-yellow': 'changeToYellow 2s ease-in-out 5.75s forwards',
        'move-up-old-number': 'moveUpOld 5s ease-in-out 5s forwards',
        'drop-new-number': 'dropNew 6s ease-in-out forwards',
        float: 'float 10s ease-in-out forwards',
        'show-firework': 'showFirework 1.5s ease-in-out 8s forwards',
        fire: 'fire 0.5s ease-in-out 9s forwards',
        'transform-from-old-to-new': 'transformFromOldToNew 1s ease-in-out 4s',
        'loader-circle-jump': 'loaderCircleJumping 2s infinite',
        loader: 'rotation 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
        'gradient-animation': 'gradientAnimation 1.2s linear infinite',
        crawling: 'borderCrawling 3s linear infinite',
        'blob-bounce': 'blobBounce 5s infinite ease',
        glider: 'glider 1s infinite linear',
        flashing: 'flash 3s infinite',
      },
    },
  },
  plugins: [
    backfaceVisibility,
    // eslint-disable-next-line global-require,import/no-extraneous-dependencies
    require('tailwindcss-3d')({ legacy: true }),
    // eslint-disable-next-line global-require,import/no-extraneous-dependencies
    require('tailwindcss-animation-delay'),
  ],
};
