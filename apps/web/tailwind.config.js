/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './views/**/*.{ts,tsx}'],
  theme: {
    screens: {
      // Desktop Wide
      min2xl: '1536px',
      max2xl: { max: '1536px' },

      // Desktop
      minXl: '1280px',
      maxXl: { max: '1280px' },

      // Laptop
      minLg: '1024px',
      maxLg: { max: '1024px' },

      // Tablet
      minMd: '900px',
      maxMd: { max: '900px' },

      // Phablet
      minSmPlus: '750px',
      maxSmPlus: { max: '750px' },

      // Mobile Wide
      minSm: '640px',
      maxSm: { max: '640px' },

      // Mobile
      minXsPlus: '520px',
      maxXsPlus: { max: '520px' },

      // Mobile Compact
      minXs: '460px',
      maxXs: { max: '460px' },

      // Small Mobile
      min2xs: '400px',
      max2xs: { max: '400px' },

      // Tiny Mobile
      min3xs: '340px',
      max3xs: { max: '340px' },
    },
    extend: {
      colors: {
        primary: {
          dark: '#1b1f3b',
          light: '#f5faff',
        },
        secondary: {
          dark: '#ff6b6b',
          light: '#4f9da6',
        },
        body: {
          dark: '#121212',
          light: '#ffffff',
        },
        card: {
          dark: '#2c2f4a',
          light: '#fefefe',
        },
        text: {
          dark: '#f4f4f5',
          light: '#1e293b',
        },
        hover: {
          dark: '#3a3f5c',
          light: '#e0f2ff',
        },
        border: {
          dark: '#5c5f72',
          light: '#cbd5e1',
        },
        skeleton: {
          dark: '#4b5563',
          light: '#e2e8f0',
        },
      },
      width: {
        68: '17rem',
        88: '22rem',
        102: '26rem',
        108: '28rem',
        128: '32rem',
        140: '36rem',
        152: '40rem',
        164: '44rem',
        176: '48rem',
        180: '52rem',
      },
      maxWidth: {
        68: '17rem',
        88: '22rem',
        102: '26rem',
        108: '28rem',
        128: '32rem',
        140: '36rem',
        152: '40rem',
        164: '44rem',
        176: '48rem',
        180: '52rem',
      },
      minWidth: {
        68: '17rem',
        88: '22rem',
        102: '26rem',
        108: '28rem',
        128: '32rem',
        140: '36rem',
        152: '40rem',
        164: '44rem',
        176: '48rem',
        180: '52rem',
      },
      margin: {
        13: '52px',
        15: '60px',
      },
      animation: {
        'spin-slow': 'spin 4s linear infinite',
        'spin-slow-hover': 'spin 10s linear infinite',
        fadeIn: 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
