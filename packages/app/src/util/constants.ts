import getConfig from "next/config";

const nextConfig = getConfig().publicRuntimeConfig;

export const Constants = {
  API_URL: nextConfig.API_URL as string,
  hotjarConfig: { ID: 2731946, version: 6 },
};
