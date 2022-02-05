const fs = require("fs");
const yaml = require("yaml");
const envYamlPath = process.argv[2];
const env = yaml.parse(fs.readFileSync(envYamlPath, "utf8")).env_variables;
env.RUN_MIGRATIONS = false;
env.SUPERADMIN_USER_IDS = "";
env.REDIS_URL = "local";
console.log(
  Object.keys(env)
    .map((key) => `${key}=${env[key]}`)
    .join(",")
);
