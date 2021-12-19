import { useCallback } from "react";
import { ethers } from "ethers";
import Safe, { EthersAdapter } from "@gnosis.pm/safe-core-sdk";

export function useIsGnosisSafeOwner(): (
  safeAddress: string,
  signer: ethers.Signer
) => Promise<boolean> {
  return useCallback(async (safeAddress, signer) => {
    const ethAdapter = new EthersAdapter({ ethers, signer });
    const safe = await Safe.create({ ethAdapter, safeAddress });
    return safe.isOwner(await signer.getAddress());
  }, []);
}
