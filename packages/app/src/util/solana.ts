import { useCallback } from "react";
import {
  Connection,
  PublicKey,
  Transaction,
  clusterApiUrl,
  SystemProgram,
  RpcResponseAndContext,
  SignatureResult,
} from "@solana/web3.js";

export function useRequestSolanaAddress(): () => Promise<string> {
  return useCallback(async () => {
    // @ts-ignore
    const provider = await window.solana;
    const connect = await provider.connect();
    return connect.publicKey.toString();
  }, []);
}

export function useSignPhantomPayout(): (
  toAddress: string,
  amount: number
) => Promise<RpcResponseAndContext<SignatureResult>> {
  return useCallback(async (toAddress, amount) => {
    // @ts-ignore
    const provider = await window.solana;
    await provider.connect();

    const NETWORK = clusterApiUrl("mainnet-beta");
    const CONNECTION = new Connection(NETWORK);
    const transaction = new Transaction().add(
      ...[
        SystemProgram.transfer({
          fromPubkey: provider.publicKey,
          toPubkey: new PublicKey(toAddress),
          lamports: solToLamports(amount),
        }),
      ]
    );
    transaction.recentBlockhash = (
      await CONNECTION.getRecentBlockhash()
    ).blockhash;
    transaction.feePayer = provider.publicKey;
    // @ts-ignore
    const { signature } = await window.solana.signAndSendTransaction(
      transaction
    );
    return CONNECTION.confirmTransaction(signature);
  }, []);
}

const solToLamports = (sol: number) => {
  return sol * 1000000000;
};
