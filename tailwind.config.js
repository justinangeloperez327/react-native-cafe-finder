module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: { extend: { colors: { coffee: { 50: '#FAF8F5', 100: '#F1EAE2', 500: '#967354', 700: '#6F4E37', 900: '#30241D' } } } },
  plugins: [],
};
