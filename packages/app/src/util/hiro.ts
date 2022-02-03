import { useCallback } from "react";
import { FinishedAuthData, FinishedTxData, UserSession } from "@stacks/connect";
import { StacksNetwork, StacksMainnet, StacksTestnet } from "@stacks/network";
import {
  PaymentNetwork,
  PaymentToken,
  PaymentTokenType,
} from "../graphql/types";
import { siteTitle } from "./constants";

const stacksNetworkBySlug: Record<string, StacksNetwork> = {
  "stacks-mainnet": new StacksMainnet(),
  "stacks-testnet": new StacksTestnet(),
};

export function useRequestUserSession(): () => Promise<UserSession> {
  return useCallback(async () => {
    const { showConnect } = await import("@stacks/connect");
    const res = await new Promise<FinishedAuthData>((resolve, reject) =>
      showConnect({
        appDetails: { name: siteTitle, icon: "https://dework.xyz/logo.svg" },
        onFinish: resolve,
        onCancel: reject,
      })
    );
    return res.userSession;
  }, []);
}

export function useRequestAddresses(): () => Promise<{
  "stacks-testnet": string;
  "stacks-mainnet": string;
}> {
  const requestUserSession = useRequestUserSession();
  return useCallback(async () => {
    const userSession = await requestUserSession();
    const userData = userSession.loadUserData();
    return {
      "stacks-testnet": userData.profile.stxAddress.testnet,
      "stacks-mainnet": userData.profile.stxAddress.mainnet,
    };
  }, [requestUserSession]);
}

export function useCreateStacksTransaction(): (
  fromAddress: string,
  toAddress: string,
  amount: string,
  token: PaymentToken,
  network: PaymentNetwork
) => Promise<string> {
  const requestUserSession = useRequestUserSession();
  return useCallback(
    async (_fromAddress, toAddress, amount, token, network) => {
      const stacksNetwork = stacksNetworkBySlug[network.slug];
      if (!stacksNetwork) {
        throw new Error(`Unknown Stacks network: ${network.slug}`);
      }

      switch (token.type) {
        case PaymentTokenType.NATIVE: {
          const userSession = await requestUserSession();
          const { openSTXTransfer } = await import("@stacks/connect");
          const res = await new Promise<FinishedTxData>((resolve, reject) =>
            openSTXTransfer({
              amount,
              recipient: toAddress,
              network: stacksNetwork,
              userSession,
              onFinish: resolve,
              onCancel: reject,
            })
          );

          if (typeof res.txId === "string") return res.txId;
          const txData = res.txId as any as {
            txid: string;
            error?: string;
            reason?: string;
          };
          if (!!txData.error && !!txData.reason) {
            throw new Error(`${txData.error}: ${txData.reason}`);
          }

          return txData.txid;
        }
        default:
          throw new Error(
            `Stacks payments for tokens type "${token.type}" not implemented`
          );
      }
    },
    [requestUserSession]
  );
}
