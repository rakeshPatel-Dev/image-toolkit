/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🎨 Your custom color palette
        'fair-black': "#0f0f0f",
        darkcard: "#1C1C1C",
        accent: "#00ADB5",
        lighttext: "#EEEEEE",
        midtext: "#B0B0B0",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
}
