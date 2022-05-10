import { useCallback } from "react";
import { useRequestSigner, useSwitchChain } from "./ethereum";
import { MetaTransactionData } from "@gnosis.pm/safe-core-sdk-types";
import { PaymentNetwork } from "../graphql/types";
import { Signer } from "ethers";
import SafeServiceClientType from "@gnosis.pm/safe-service-client";

export function useRequestSafe() {
  const requestSigner = useRequestSigner();
  return useCallback(
    async (safeAddress: string) => {
      const ethers = await import("ethers");
      const { EthersAdapter, default: Safe } = await import(
        "@gnosis.pm/safe-core-sdk"
      );
      const signer = await requestSigner();
      const ethAdapter = new EthersAdapter({ ethers, signer });
      return Safe.create({ ethAdapter, safeAddress });
    },
    [requestSigner]
  );
}

export function useIsGnosisSafeOwner(): (
  safeAddress: string,
  signer: Signer
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

/*
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
  const requestAddress = useRequestAddress();
  const requestSafe = useRequestSafe();
  return useCallback(
    async (safeAddress, toAddress, amount, uuid) => {
      const senderAddress = await requestAddress();
      const safe = await requestSafe(safeAddress);
      const safeTransaction = await safe.createTransaction({
        to: toAddress,
        value: ethers.utils.parseEther(String(amount)).toString(),
        data: `0x${uuid.replace(/-/g, "")}`,
      });

      const safeTxHash = await safe.getTransactionHash(safeTransaction);
      // const approvers = await safe.getOwnersWhoApprovedTx(safeTxHash);

      const threshold = await safe.getThreshold();
      if (threshold === 1) {
        const response = await safe.executeTransaction(safeTransaction);
        return { txHash: response.hash, safeTxHash };
      } else {
        const safeServiceUrl = safeServiceUrlByNetworkSlug[network.slug]
        const safeService = new SafeServiceClient(
          safeServiceUrl
        );

        await safe.signTransaction(safeTransaction);
        await safeService.proposeTransaction({
          safeAddress,
          safeTransaction,
          safeTxHash,
          senderAddress,
        });
        throw new Error("TODO: add multisig support");
      }
    },
    [requestSafe, requestAddress]
  );
}
*/

export function useProposeTransaction(): (
  safeAddress: string,
  transactions: MetaTransactionData[],
  network: PaymentNetwork
) => Promise<string> {
  const requestSigner = useRequestSigner();
  const requestSafe = useRequestSafe();
  const switchChain = useSwitchChain();
  const isSafeOwner = useIsGnosisSafeOwner();
  return useCallback(
    async (safeAddress, transactions, network) => {
      const safeServiceUrl = network.config?.gnosisSafe?.serviceUrl;
      if (!safeServiceUrl) {
        throw new Error(`No safe service for ${network.slug}`);
      }

      const { utils } = await import("ethers");
      const { default: SafeServiceClient } = await import(
        "@gnosis.pm/safe-service-client"
      );
      const safeService: SafeServiceClientType = new SafeServiceClient(
        safeServiceUrl
      );

      await switchChain(network);
      const signer = await requestSigner();

      const isOwner = await isSafeOwner(safeAddress, signer);
      if (!isOwner) {
        throw new Error("Only Gnosis Safe owners can sign transactions");
      }

      const safe = await requestSafe(safeAddress);
      const safeTransaction = await safe.createTransaction(
        transactions.map((tx) => ({ ...tx, to: utils.getAddress(tx.to) })),
        { nonce: await safeService.getNextNonce(safeAddress) }
      );

      const safeTxHash = await safe.getTransactionHash(safeTransaction);
      await safe.signTransaction(safeTransaction);
      await safeService.proposeTransaction({
        safeAddress,
        safeTransaction,
        safeTxHash,
        senderAddress: await signer.getAddress(),
      });

      return safeTxHash;
    },
    [requestSigner, requestSafe, switchChain, isSafeOwner]
  );
}
