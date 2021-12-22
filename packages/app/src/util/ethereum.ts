import { useCallback, useMemo } from "react";
import { ethers } from "ethers";

const ethereumChainIdBySlug: Record<string, number> = {
  "ethereum-mainnet": 1,
  "ethereum-rinkeby": 4,
};

export function useProvider(): ethers.providers.Web3Provider {
  return useMemo(
    () =>
      typeof window !== "undefined" &&
      // @ts-ignore
      !!window.ethereum
        ? new ethers.providers.Web3Provider(
            // @ts-ignore
            window.ethereum
          )
        : (undefined! as ethers.providers.Web3Provider),
    []
  );
}

export function useSwitchChain(): (slug: string) => Promise<void> {
  const provider = useProvider();
  return useCallback(
    async (slug) => {
      const chainId = ethereumChainIdBySlug[slug];
      await provider.send("wallet_switchEthereumChain", [
        { chainId: `0x${chainId}` },
      ]);
    },
    [provider]
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
) => Promise<string> {
  const requestSigner = useRequestSigner();
  return useCallback(
    async (toAddress, amount) => {
      const signer = await requestSigner();
      const tx = await signer.sendTransaction({
        to: toAddress,
        from: signer.getAddress(),
        value: ethers.utils.parseEther(String(amount)),
      });

      return tx.hash;
    },
    [requestSigner]
  );
}
