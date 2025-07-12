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
    '.perspective-900': {
      perspective: '900px',
    },
    '.preserve-3d': {
      transformStyle: 'preserve-3d',
    },
    '.transition-transform-075s': {
      transition: 'transform 0.75s ease',
    },
    '.rotate-y-30': {
      transform: 'rotateY(-30deg)',
    },
    '.content-empty': {
      content: '" "',
    },
    '.page-transform': {
      transform:
        'translateX(calc(200px - 50px / 2 - 3px)) rotateY(90deg) translateX(25px)',
    },
    '.back-cover-transform': {
      transform: 'translateZ(-50px)',
    },
  });
});

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
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
      // primary: '#0061EF',
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
          50: '#C9ECFF',
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
          50: '#F3C00C',
          60: '#F6CE3C',
          90: '#FDF3CE',
          98: '#FFFDF5',
        },
        neutral: {
          1: '#03191C',
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
            80: '#C2C6CF',
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
          70: '#4682FB',
          80: '#84ACFC',
          90: '#CDDDFE',
          98: '#F0F5FF',
        },
        red: {
          50: '#EE0038',
          70: '#FF5C82',
          90: '#FFC9D5',
          98: '#FFF5F7',
        },
        pink: {
          50: '#FF77BA',
          90: '#FFE4F1',
        },
        green: {
          30: '#2A8010',
          50: '#46D51B',
          60: '#66E73F',
          90: '#D9F9CF',
          98: '#FBFEFA',
        },
        // lp: only for Landing Page
        lp: {
          'primary-blue': '#0061EF',
        },
        orange: {
          50: '#FF8207',
          70: '#FFAB67',
          90: '#FFE4D1',
          98: '#FFF9F5',
        },
      },
      boxShadow: {
        sm: '0 4px 5px 0 rgba(28, 30, 33, 0.1), 0 0px 4px 0 rgba(15, 15, 16, 0.06)',
        popover: '0 6px 10px -1px #1C1E2124, 0 0 4px 0 #0F0F1014',
        popup: '0 8px 18px -1px #1C1E2124, 0 0 4px 0 #0F0F1014',
        'focus-input': '0 0 0 4px rgba(205, 221, 254)',
        tooltip:
          '0 4px 5px 0 rgba(28, 30, 33, 0.10), 0 0 4px 0 rgba(15, 15, 16, 0.06)',
      },
      rotate: {
        30: '30deg',
        60: '60deg',
        120: '120deg',
        150: '150deg',
        180: '180deg',
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
      transformOrigin: {
        right: 'right',
      },
      perspective: {
        '1000px': '1000px',
      },
      transform: ['group-hover'],
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
    animation: {
      shimmer: 'shimmer 1.5s infinite',
    },
    keyframes: {
      shimmer: {
        '100%': { transform: 'translateX(300px)' },
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
