module.exports = {
  theme: {
    extend: {
      backgroundImage: {
        'stripes': 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(156, 163, 175, 0.15) 4px, rgba(156, 163, 175, 0.15) 8px)'
      }
    }
  },
  important: true,
  content: ['./src/**/*.{html,ts}'],
  variants: {
    margin: ['last'],
    padding: ['last'],
    borderWidth: ['last'],
  },
  plugins: [],
};
