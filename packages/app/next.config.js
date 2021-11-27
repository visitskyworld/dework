/** @type {import('next').NextConfig} */

const withLess = require("next-with-less");

module.exports = withLess({
  reactStrictMode: true,
  publicRuntimeConfig: {
    API_URL: process.env.API_URL,
  },
});
