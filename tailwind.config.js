/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cabinet': {
          'black': '#121212',
          'white': '#F5F5F5',
          'gray': '#A1A1A1',
          'blue': '#1951F3',
          'blue-dark': '#153182',
          'purple': '#6E00BB',
          'light-gray': '#EFEFF2',
          'dark-gray': '#414141',
          'border-gray': '#C9CBD3',
          'accent-blue': '#345BCD',
          'accent-purple': '#3735E0',
          'muted-gray': '#6B707F',
          'text-muted': '#D4D8E3',
          'bg-card': '#CFD3E1',
        }
      },
      fontFamily: {
        'tt-autonomous': ['TT Autonomous Trial Variable', '-apple-system', 'Roboto', 'Helvetica', 'sans-serif'],
        'tt-mono': ['TT Autonomous Mono Trl', '-apple-system', 'Roboto', 'Helvetica', 'sans-serif'],
        'inter': ['Inter', '-apple-system', 'Roboto', 'Helvetica', 'sans-serif'],
      },
      backdropBlur: {
        '15': '15px',
        '30': '30px',
      }
    },
  },
  plugins: [],
  corePlugins: {
    outline: true,
  },
}
