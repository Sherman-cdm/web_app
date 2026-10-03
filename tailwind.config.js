export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 50: '#edf9f6', 100: '#d5f0e7', 600: '#087b70', 700: '#07635b', 900: '#123e39' },
      },
      boxShadow: { soft: '0 8px 32px -16px rgb(18 62 57 / 22%)' },
    },
  },
  plugins: [],
};
