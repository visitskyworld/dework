require("dotenv").config({ path: "./.env.prod" });
const path = require("path");

module.exports = {
  type: "postgres",
  url: process.env.POSTGRES_URL,
  entities: [path.join(__dirname, "build/models/**/*.js")],
  migrations: [path.join(__dirname, "build/migrations/**/*.js")],
  logging: "all",
};
