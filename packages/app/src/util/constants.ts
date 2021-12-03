import getConfig from "next/config";

const nextConfig = getConfig().publicRuntimeConfig;

export const Constants = {
  TREASURY_CONTRACT_ADDRESS: "0xD258Cb4EB328F2a3cb6A42d028e3bcCd4B1A7C41",
  TREASURY_CONTRACT_ABI: require("@dewo/app/abis/Transaction.json"),
  API_URL: nextConfig.API_URL as string,
  hotjarConfig: { ID: 2731946, version: 6 },
};
