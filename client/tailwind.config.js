import('tailwindcss').Config

const config = {
  content: ["./src/**/*.{html,ts}"],
  plugins: [require("tailwindcss-animate")],
};

module.exports = config;

