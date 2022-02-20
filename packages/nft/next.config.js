/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    API_URL: process.env.API_URL,
    NFT_URL: process.env.NFT_URL,
  },
};
