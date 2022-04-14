import getConfig from "next/config";

const nextConfig = getConfig().publicRuntimeConfig;

export const Constants = {
  GRAPHQL_API_URL: nextConfig.GRAPHQL_API_URL as string,
  GRAPHQL_WS_URL: nextConfig.GRAPHQL_WS_URL as string,
  GITHUB_APP_URL: nextConfig.GITHUB_APP_URL as string,
  APP_URL: nextConfig.APP_URL as string,
  SENTRY_DSN: nextConfig.SENTRY_DSN as string,
  DEV_ROLE_ID: nextConfig.DEV_ROLE_ID as string,
  AMPLITUDE_API_KEY: nextConfig.AMPLITUDE_API_KEY as string,
  APOLLO_QUERY_LOGGING: nextConfig.APOLLO_QUERY_LOGGING as boolean,
  ENVIRONMENT: nextConfig.ENVIRONMENT as "prod" | "demo" | "dev",
  NUM_DECIMALS_IN_USD_PEG: 6,
  hotjarConfig: { ID: 2731946, version: 6 },
};

export const siteTitle = "Dework";
export const siteDescription =
  "The task manager for DAOs and decentralized work";
export const siteURL = "https://dework.xyz";

const docsBase = "https://dework-community.gitbook.io/product-docs";

export const deworkSocialLinks = {
  twitter: "https://twitter.com/deworkxyz",
  discord: "https://discord.gg/rPEsPzShd7",
  gitbook: {
    index: docsBase,
    connectingToDiscord: `${docsBase}/guides/connecting-to-discord`,
    bountyTypesAndGating: `${docsBase}/fundamentals/bounty-types-and-gating`,
  },
};
