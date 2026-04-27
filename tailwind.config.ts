import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        green: {
          50: '#f0faf0', 100: '#d4f0d2', 200: '#a8e0a4',
          300: '#72c870', 400: '#4ea84e', 500: '#3d8f3d',
          600: '#2a7a2a', 700: '#1f5e1f', 800: '#163e16', 900: '#0c260c',
        },
      },
    },
  },
  plugins: [],
}
export default config
