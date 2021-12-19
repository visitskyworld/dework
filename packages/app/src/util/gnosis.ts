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

/*

      const tx = await safeSdk.createTransaction([
        {
          to: "0x761996F7258A19B6aCcF6f22e9Ca8CdAA92D75A6",
          value: ethers.utils.parseEther("0.001").toString(),
          // TODO(fant): figure out what this is... Should it refer to e.g. the Dework task id?
          // data: `0x${"watafak should be here"}`,
          data: "0x761996F7258A19B6aCcF6f22e9Ca8CdAA92D75A6",
        },
      ]);

      console.warn("created tx");

      // await safeSdk.signTransaction(tx);
      // await safeSdk.signTransaction(tx);

      const txHash = await safeSdk.getTransactionHash(tx);
      console.warn({ tx, txHash });

      // const response = await safeSdk.approveTransactionHash(txHash);
      // console.warn({ response });

      const executeTxResponse = await safeSdk.executeTransaction(tx);
      console.warn({ executeTxResponse });

*/
