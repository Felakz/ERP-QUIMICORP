/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: '#0B4F6C',
          teal: '#00F2C3',
          cyan: '#00F2C3',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
          blue: '#3B82F6',
        },
        surface: {
          canvas: '#0B0F17',
          card: '#0F141C',
          subtle: '#151D2A',
          hover: '#1E293B',
        },
        border: {
          subtle: '#1A2232',
          muted: '#27354A',
          accent: 'rgba(0, 242, 195, 0.4)',
        },
      },
    },
  },
  plugins: [],
};
