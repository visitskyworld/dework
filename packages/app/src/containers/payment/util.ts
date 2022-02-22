import { PaymentMethodType } from "@dewo/app/graphql/types";

export const paymentMethodTypeToString: Record<PaymentMethodType, string> = {
  [PaymentMethodType.METAMASK]: "Metamask",
  [PaymentMethodType.GNOSIS_SAFE]: "Gnosis Safe",
  [PaymentMethodType.PHANTOM]: "Phantom Wallet",
  [PaymentMethodType.HIRO]: "Hiro Wallet",
};

export const networkSlugsByPaymentMethodType: Record<
  PaymentMethodType,
  string[]
> = {
  [PaymentMethodType.METAMASK]: [
    "ethereum-mainnet",
    "ethereum-rinkeby",
    "gnosis-chain",
    "polygon-mainnet",
    "sokol-testnet",
    "harmony-mainnet",
    "harmony-testnet",
    "arbitrum-mainnet",
    "optimism-mainnet",
    "fuse-mainnet",
    "bsc-mainnet",
    "avalanche-mainnet",
    "fantom-mainnet",
  ],
  [PaymentMethodType.GNOSIS_SAFE]: [
    "ethereum-mainnet",
    "ethereum-rinkeby",
    "gnosis-chain",
    "polygon-mainnet",
    "harmony-mainnet",
    "bsc-mainnet",
  ],
  [PaymentMethodType.PHANTOM]: ["solana-mainnet", "solana-testnet"],
  [PaymentMethodType.HIRO]: ["stacks-mainnet", "stacks-testnet"],
};
