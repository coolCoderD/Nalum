/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primaryRed: '#B43737', // Brick
        secondaryRed: '#7F1F22', // Crimson
        text: '#181818', // Slate
        subtleText: '#616161', // Light Slate
        tertiaryBrand: '#F39D3A', // Peach
        light: '#FFFFFF', // Cloud
      },
    },
  },
  plugins: [],
};
