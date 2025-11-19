import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
content: [
  './app/**/*.{ts,tsx,js,jsx}',
  './components/**/*.{ts,tsx,js,jsx}',
  './src/app/**/*.{ts,tsx,js,jsx}',
  './src/components/**/*.{ts,tsx,js,jsx}',
],
  theme: { extend: {} },
  plugins: [],
};
export default config;
