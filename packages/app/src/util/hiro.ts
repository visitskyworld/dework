import { useCallback } from "react";
import { siteTitle } from "./constants";
import { FinishedAuthData, showConnect, UserSession } from "@stacks/connect";

export function useRequestUserSession(): () => Promise<UserSession> {
  return useCallback(async () => {
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
