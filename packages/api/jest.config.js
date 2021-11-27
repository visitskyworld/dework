// https://github.com/dividab/tsconfig-paths/issues/97#issuecomment-542650519
const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("../../tsconfig");

module.exports = {
  preset: "ts-jest",
  verbose: true,
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  setupFilesAfterEnv: ["<rootDir>/src/testing/dotenv.ts"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/../../",
  }),
};
