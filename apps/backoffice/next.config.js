/* eslint-disable @typescript-eslint/no-var-requires */
const withPlugins = require("next-compose-plugins");
const withTM = require("next-transpile-modules")(["ui", "domain"]);
const { i18n } = require("./next-i18next.config");

const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    domains: ["storage.googleapis.com"],
  },
};

module.exports = withPlugins([withTM], nextConfig);
