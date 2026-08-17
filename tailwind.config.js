/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F5F5F7',
        surface: '#FFFFFF',
        ink: '#1D1D1F',
        'ink-soft': '#86868B',
        teal: { DEFAULT: '#2F6F7E', deep: '#1C4A55', soft: '#E5F0EF' },
        coral: { DEFAULT: '#FF3B30', deep: '#C92A22', soft: '#FFEBEA' },
        peri: { DEFAULT: '#5E5CE6', soft: '#EFEFFC' },
        sage: { DEFAULT: '#34C759', soft: '#EBF9EE' },
        amber: { DEFAULT: '#FF9F0A', soft: '#FFF5E6' },
        line: 'rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        serif: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        roboto: ['Roboto', 'sans-serif'],
      },
      borderRadius: { xl2: '20px' },
      boxShadow: {
        brand: '0 8px 30px rgba(0, 0, 0, 0.04), 0 4px 10px rgba(0, 0, 0, 0.03)',
        'brand-sm': '0 4px 12px rgba(0, 0, 0, 0.05)',
        glow: '0 0 0 4px rgba(47, 111, 126, 0.15)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #2F6F7E 0%, #6FB7B0 100%)',
        'brand-gradient-soft': 'linear-gradient(135deg, rgba(229, 240, 239, 0.9), rgba(255, 255, 255, 0.65))',
        'invitado-gradient': 'linear-gradient(135deg, #6FB7B0 0%, #2F6F7E 100%)',
      },
    },
  },
  plugins: [],
};
