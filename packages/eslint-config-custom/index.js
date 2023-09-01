module.exports = {
  plugins: ["@typescript-eslint"],
  extends: [
    "next",
    "prettier",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    "@next/next/no-html-link-for-pages": 0,
    "react/jsx-key": 1,
    "@typescript-eslint/no-unused-vars": 1,
  },
};
