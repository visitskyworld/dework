import { PaymentMethodType } from "@dewo/app/graphql/types";

export const paymentMethodTypeToString: Record<PaymentMethodType, string> = {
  [PaymentMethodType.METAMASK]: "Metamask",
  [PaymentMethodType.GNOSIS_SAFE]: "Gnosis Safe",
  [PaymentMethodType.PHANTOM]: "Phantom",
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
    "avalanche-mainnet",
    "fantom-mainnet",
  ],
  [PaymentMethodType.GNOSIS_SAFE]: [
    "ethereum-mainnet",
    "ethereum-rinkeby",
    "gnosis-chain",
    "polygon-mainnet",
  ],
  [PaymentMethodType.PHANTOM]: ["solana-mainnet", "solana-testnet"],
};
