import type { Config } from 'tailwindcss';

const config: Config = {
  // THIS IS THE CRUCIAL LINE THAT ENABLES DARK MODE
  darkMode: 'class',

  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // We can keep specific brand and accent colors here for things like buttons and tags.
      // The general text and background colors will be handled directly in the components
      // (e.g., bg-white dark:bg-gray-900).
      colors: {
        'brand-blue': {
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
        },
        'accent-green': {
          DEFAULT: '#10B981',
          light: '#D1FAE5',
          dark: '#065F46',
        },
        'accent-red': {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
          dark: '#991B1B',
        },
      },
    },
  },
  plugins: [],
};
export default config;