/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        '.el-button': {
          'background-color': 'var(--el-button-bg-color,var(--el-color-white))',
        },
      
        '.CRX-el-button': {
          'background-color': 'var(--CRX-el-button-bg-color,var(--CRX-el-color-white))',
        },
      });
    },
  ],
};
