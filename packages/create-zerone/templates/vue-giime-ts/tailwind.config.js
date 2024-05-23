import tailwindPreset from 'giime/es/theme-chalk/tailwindPreset';
import tailwindPlugin from 'giime/es/theme-chalk/tailwindPlugin';
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  presets: [tailwindPreset],
  plugins: [
    tailwindPlugin,
    function ({ addBase }) {
      addBase({
        '.el-button': {
          'background-color': 'var(--el-button-bg-color,var(--el-color-white))',
        },
      });
    },
  ],
};
