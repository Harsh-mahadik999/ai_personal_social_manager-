/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#0A66C2",
        secondary: "#00A0DC",
        success: "#057642",
        warning: "#B24020",
        surface: "#F3F2EF"
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Nunito Sans", "sans-serif"]
      }
    }
  },
  plugins: []
};
