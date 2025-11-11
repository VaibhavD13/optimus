// tailwind.config.cjs
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'optimus-blue': {
          50: '#f3f9ff',
          100: '#eaf4ff',
          200: '#d7eaff',
          300: '#a9d3ff',
          400: '#6fb6ff',
          500: '#3B82F6', // used for bars in ref
          600: '#2563eb',
        },
        'optimus-muted': '#f6f7fb',
        'card-bg': '#ffffff',
        'muted-text': '#94a3b8'
      },
      borderRadius: {
        xl2: '14px',
        circle: '9999px'
      },
      boxShadow: {
        soft: '0 6px 18px rgba(16,24,40,0.06)',
        subtle: '0 1px 0 rgba(13,17,23,0.04)'
      }
    }
  },
  plugins: []
};