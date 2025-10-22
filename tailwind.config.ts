import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
        },
        secondary: {
          DEFAULT: '#10B981',
          dark: '#047857',
        },
        accent: {
          DEFAULT: '#F59E0B',
          dark: '#B45309',
        },
        background: {
          DEFAULT: '#121212',
          light: '#1E1E1E',
        },
        surface: '#1F2937',
      },
    },
  },
  plugins: [],
};

export default config;
