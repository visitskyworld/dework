/** @type {import('next').NextConfig} */

const withLess = require("next-with-less");
module.exports = withLess({
  reactStrictMode: true,
  publicRuntimeConfig: {
    GRAPHQL_API_URL: process.env.GRAPHQL_API_URL,
    APP_URL: process.env.APP_URL,
    ENVIRONMENT: process.env.ENVIRONMENT,
    SENTRY_DSN: process.env.SENTRY_DSN,
  },
  experimental: {
    externalDir: true,
  },
});
