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
        secondary: "#B4B4B4",
        header: "#FFFFFF",
        border: "#3D3D3D",
        text: "#999999",
        "darker-text": "#474747",
        "lighter-text": "#FFFFFF",
      },
    },
  },
  plugins: [],
};
