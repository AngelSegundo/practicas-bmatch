module.exports = {
  // This tells ESLint to load the config from the package `eslint-config-custom`
  extends: ["custom"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
  rules: {
    "react-hooks/rules-of-hooks": 0,
    "@typescript-eslint/no-var-requires": 0,
  },
};
