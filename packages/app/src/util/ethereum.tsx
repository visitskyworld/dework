import { useCallback, useMemo } from "react";
import { ethers } from "ethers";
import { Constants } from "./constants";

export function useProvider(): ethers.providers.Web3Provider {
  return useMemo(
    () =>
      new ethers.providers.Web3Provider(
        // @ts-ignore
        window.ethereum
      ),
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
  receiverAddress: string,
  amount: number
) => Promise<ethers.Transaction> {
  const requestSigner = useRequestSigner();
  return useCallback(
    async (receiverAddress, amount) => {
      const signer = await requestSigner();
      const treasury = new ethers.Contract(
        Constants.TREASURY_CONTRACT_ADDRESS,
        Constants.TREASURY_CONTRACT_ABI,
        signer
      );

      const balance = await treasury.getBalance();
      console.log("Balance before: ", balance.toString());

      return await treasury.transfer(receiverAddress, amount);
    },
    [requestSigner]
  );
}
