/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "fade-in": "fade-in 750s ease-out",
      },
      colors: {
        brand: "#FF9F1C",
        primary: "#1B1B1B",
        secondary: "#3D3D3D",
        header: "#FFFFFF",
        border: "#202020",
        text: "#999999",
        "darker-text": "#474747",
        "lighter-text": "#FFFFFF",
      },
    },
  },
  plugins: [],
};
