import { useCallback } from "react";
import { ethers } from "ethers";
import Safe, {
  EthersAdapter,
  EthSignSignature,
} from "@gnosis.pm/safe-core-sdk";
import { useRequestSigner } from "./ethereum";

export function useRequestSafe(): (safeAddress: string) => Promise<Safe> {
  const requestSigner = useRequestSigner();
  return useCallback(
    async (safeAddress) => {
      const signer = await requestSigner();
      const ethAdapter = new EthersAdapter({ ethers, signer });
      return Safe.create({ ethAdapter, safeAddress });
    },
    [requestSigner]
  );
}

export function useIsGnosisSafeOwner(): (
  safeAddress: string,
  signer: ethers.Signer
) => Promise<boolean> {
  const requestSafe = useRequestSafe();
  return useCallback(
    async (safeAddress, signer) => {
      const safe = await requestSafe(safeAddress);
      return safe.isOwner(await signer.getAddress());
    },
    [requestSafe]
  );
}

interface SignPayoutResponse {
  txHash?: string;
  safeTxHash: string;
}

export function useSignPayout(): (
  safeAddress: string,
  toAddress: string,
  amount: number,
  uuid: string
) => Promise<SignPayoutResponse> {
  const requestSafe = useRequestSafe();
  return useCallback(
    async (safeAddress, toAddress, amount, uuid) => {
      const safe = await requestSafe(safeAddress);
      const safeTransaction = await safe.createTransaction({
        to: toAddress,
        value: ethers.utils.parseEther(String(amount)).toString(),
        data: `0x${uuid.replace(/-/g, "")}`,
        // nonce: 17,
      });

      console.warn({
        value: ethers.utils.parseEther(String(amount)).toString(),
      });

      const safeTxHash = await safe.getTransactionHash(safeTransaction);
      const approvers = await safe.getOwnersWhoApprovedTx(safeTxHash);
      console.warn("approvers: ", approvers);

      const threshold = await safe.getThreshold();
      if (threshold === 1) {
        const response = await safe.executeTransaction(safeTransaction);
        return { txHash: response.hash, safeTxHash };
      } else {
        if (!approvers.length) {
          const signature = await safe.signTransactionHash(safeTxHash);
          const response = await safe.approveTransactionHash(safeTxHash);
          response.transactionResponse?.wait();
          console.warn({ response, safeTxHash, signature, safeTransaction });
        } else {
          console.warn("added signature...", {
            // safeTransaction.signatures,
            // sig1,
            // sig2,
            sigs: safeTransaction.signatures,
          });

          console.warn({ safeTransaction });

          // safe.getOwners = () => Promise.resolve([]);
          // safe.getOwnersWhoApprovedTx = () => Promise.resolve([]);

          const executeTxResponse = await safe.executeTransaction(
            safeTransaction,
            { gasLimit: 0.004 * 1e9 }
          );
          await executeTxResponse.transactionResponse?.wait();
          console.warn({ executeTxResponse });
        }

        // TODO(fant): consider getting this from the backend
        // const signature = await safe.signTransactionHash(safeTxHash);
        // safeTransaction.addSignature(signature);
        // await safe.signTransaction(safeTransaction);

        // console.warn({
        //   // response1,
        //   // signature,
        //   safeTransaction,
        //   encSigs: safeTransaction.encodedSignatures(),
        // });

        throw new Error("TODO: add multisig support");
      }
    },
    [requestSafe]
  );
}

/*



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
        value: ethers.utils.parseEther(String(amount)),
      });
    },
    [requestSigner]
  );
}









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
