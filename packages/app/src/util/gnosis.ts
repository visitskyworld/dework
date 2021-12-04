import SafeAppsSDK from "@gnosis.pm/safe-apps-sdk";
import { useCallback, useMemo } from "react";

export function useRequestAddress(): () => Promise<string> {
  const gnosis = useMemo(() => new SafeAppsSDK({ debug: true }), []);
  return useCallback(async () => {
    const safe = await gnosis.safe.getInfo();
    return safe.safeAddress;
  }, [gnosis]);
}
