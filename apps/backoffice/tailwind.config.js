const primaryColorGradients = {
  50: "#eff6ff",
  100: "#dbeafe",
  200: "#bfdbfe",
  300: "#93c5fd",
  400: "#60a5fa",
  500: "#3b82f6",
  600: "#2563eb",
  700: "#1d4ed8",
  800: "#1e40af",
  900: "#1e3a8a",
};

module.exports = {
  content: [
    "../../packages/ui/**/*.{js,ts,jsx,tsx}",
    "../../packages/shared/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern:
        /(text|bg|border)-(orange|green|blue|yellow|gray|rose)-(50|200|100|700)/,
      variants: ["hover"],
    },
  ],
  theme: {
    extend: {
      theme: {
        colors: {
          primary: "#eff6ff",
        },
        bg: {
          primary: primaryColorGradients,
        },
      },
    },
  },
  plugins: [],
};
