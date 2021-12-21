import { useCallback } from "react";
import * as solana from "@solana/web3.js";
import {
  PaymentNetwork,
  PaymentToken,
  PaymentTokenType,
} from "../graphql/types";

export function useRequestAddress(): () => Promise<string> {
  return useCallback(async () => {
    // @ts-ignore
    const provider = await window.solana;
    const connect = await provider.connect();
    return connect.publicKey.toString();
  }, []);
}

export function useCreateSolanaTransaction(): (
  fromAddress: string,
  toAddress: string,
  amount: number,
  token: PaymentToken,
  network: PaymentNetwork
) => Promise<string> {
  const requestAddress = useRequestAddress();
  return useCallback(
    async (fromAddress, toAddress, amount, token, network) => {
      if (token.type !== PaymentTokenType.SOL) {
        throw new Error("TODO: implement Solana payments for other tokens");
      }

      const currentAddress = await requestAddress();
      if (currentAddress !== fromAddress) {
        throw new Error(`Change Phantom Wallet address to "${fromAddress}"`);
      }

      const fromPubkey = new solana.PublicKey(fromAddress);
      const connection = new solana.Connection(network.url);
      const recentBlock = await connection.getRecentBlockhash();
      const transaction = new solana.Transaction({
        recentBlockhash: recentBlock.blockhash,
        feePayer: fromPubkey,
      });
      transaction.add(
        solana.SystemProgram.transfer({
          fromPubkey,
          toPubkey: new solana.PublicKey(toAddress),
          lamports: amount,
        })
      );

      // @ts-ignore
      const { signature } = await window.solana.signAndSendTransaction(
        transaction
      );
      // await connection.confirmTransaction(signature);
      return signature;
    },
    [requestAddress]
  );
}
