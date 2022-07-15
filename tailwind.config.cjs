// eslint-disable-next-line @typescript-eslint/no-var-requires
// const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        thumbnail: ["Work Sans", "sans-serif"],
        sans: ['Graphik', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      fontSize: {
        "huge": "8rem",
        "2huge": "18rem",
        "3huge": "24rem",
      },
      colors: {
        'primary': '#1fb6ff',
        'secondary': '#ffc107',
      },
      spacing: {
        '8xl': '96rem',
        '9xl': '128rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    }
  },
}
