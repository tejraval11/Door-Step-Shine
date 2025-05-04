/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      // Custom Colors
      colors: {
        primary: '#5A67D8',    // Custom primary color
        secondary: '#A0AEC0',  // Custom secondary color
        accent: '#F56565',     // Custom accent color
        background: '#EDF2F7', // Custom background color
      },

      // Keyframes for custom animations
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },

      // Custom animations
      animation: {
        fadeInUp: 'fadeInUp 1s ease-out forwards',
      },

      // Custom screen sizes for responsive design
      screens: {
        xs: "480px",   // Extra small screens
        sm: "768px",   // Small screens
        md: "1060px",  // Medium screens
      },
    },
  },

  plugins: [
    require('@tailwindcss/typography'), // Tailwind Typography plugin
  ],
}
