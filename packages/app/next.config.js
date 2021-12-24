/** @type {import('next').NextConfig} */

const withLess = require("next-with-less");
const removeImports = require("next-remove-imports")();
module.exports = withLess(
  removeImports({
    reactStrictMode: true,
    publicRuntimeConfig: {
      GRAPHQL_API_URL: process.env.GRAPHQL_API_URL,
      GRAPHQL_WS_URL: process.env.GRAPHQL_WS_URL,
      GITHUB_APP_URL: process.env.GITHUB_APP_URL,
      ENVIRONMENT: process.env.ENVIRONMENT,
    },
  })
);
