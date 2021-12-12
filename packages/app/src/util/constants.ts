import getConfig from "next/config";

const nextConfig = getConfig().publicRuntimeConfig;

export const Constants = {
  GRAPHQL_API_URL: nextConfig.GRAPHQL_API_URL as string,
  GRAPHQL_WS_URL: nextConfig.GRAPHQL_WS_URL as string,
  hotjarConfig: { ID: 2731946, version: 6 },
};

export const siteTitle = "dewo";
export const siteDescription =
  "the task manager for DAOs and decentralized work";
