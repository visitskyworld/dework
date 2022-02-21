/** @type {import('next').NextConfig} */
const fs = require("fs");

module.exports = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    API_URL: process.env.API_URL,
    SCREENSHOTTER_URL: process.env.SCREENSHOTTER_URL,
  },
  publicRuntimeConfig: {
    FONT_AVENIR_REGULAR_BASE64: fs
      .readFileSync("./styles/fonts/AvenirNextLTPro-Regular.otf")
      .toString("base64"),
    FONT_AVENIR_BOLD_BASE64: fs
      .readFileSync("./styles/fonts/AvenirNextLTPro-Bold.otf")
      .toString("base64"),
  },
};
