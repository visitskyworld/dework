/** @type {import('next').NextConfig} */
const path = require("path");
const withLess = require("next-with-less");
const withRemoveImports = require("next-remove-imports")();
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = [withLess, withRemoveImports, withBundleAnalyzer].reduce(
  (config, plugin) => plugin(config),
  {
    reactStrictMode: true,
    publicRuntimeConfig: {
      GRAPHQL_API_URL: process.env.GRAPHQL_API_URL,
      GRAPHQL_WS_URL: process.env.GRAPHQL_WS_URL,
      GITHUB_APP_URL: process.env.GITHUB_APP_URL,
      ENVIRONMENT: process.env.ENVIRONMENT,
      SENTRY_DSN: process.env.SENTRY_DSN,
      DEV_ROLE_ID: process.env.DEV_ROLE_ID,
    },
    webpack(config) {
      config.resolve.alias["bn.js"] = path.resolve(
        __dirname,
        "../../node_modules/bn.js"
      );
      return config;
    },
  }
);
