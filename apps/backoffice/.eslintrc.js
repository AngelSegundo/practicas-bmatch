module.exports = {
  root: true,
  extends: ["custom", "plugin:@typescript-eslint/recommended"],
  rules: {
    "@typescript-eslint/no-empty-function": "off",
    "react-hooks/exhaustive-deps": "off",
  },
  settings: {
    next: {
      rootDir: ["apps/*/", "packages/*/"],
    },
  },
};
