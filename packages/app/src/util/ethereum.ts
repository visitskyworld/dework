import { useCallback, useMemo } from "react";
import { ethers } from "ethers";
import { Constants } from "./constants";

export function useProvider(): ethers.providers.Web3Provider {
  return useMemo(
    () =>
      typeof window !== "undefined"
        ? new ethers.providers.Web3Provider(
            // @ts-ignore
            window.ethereum
          )
        : (undefined! as ethers.providers.Web3Provider),
    []
  );
}

export function useRequestSigner(): () => Promise<ethers.Signer> {
  const provider = useProvider();
  return useCallback(async () => {
    await provider.send("eth_requestAccounts", []);
    return provider.getSigner();
  }, [provider]);
}

export function useRequestAddress(): () => Promise<string> {
  const requestSigner = useRequestSigner();
  return useCallback(async () => {
    const signer = await requestSigner();
    return signer.getAddress();
  }, [requestSigner]);
}

export function useSignPayout(): (
  toAddress: string,
  amount: number
) => Promise<ethers.Transaction> {
  const requestSigner = useRequestSigner();
  return useCallback(
    async (toAddress, amount) => {
      const signer = await requestSigner();
      return signer.sendTransaction({
        to: toAddress,
        from: signer.getAddress(),
        value: ethers.utils.parseEther(String(amount / 10e9)),
      });
    },
    [requestSigner]
  );
}
