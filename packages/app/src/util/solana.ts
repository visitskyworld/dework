import React, { useCallback } from "react";
import {
  Connection,
  PublicKey,
  Transaction,
  clusterApiUrl,
  SystemProgram,
  TransactionInstruction,
  SendOptions,
  RpcResponseAndContext,
  SignatureResult,
} from "@solana/web3.js";

export function useRequestSolanaAddress(): () => Promise<string> {
  return useCallback(async () => {
    // @ts-ignore
    const provider = await window.solana;
    const connect = await provider.connect();
    console.log("connect", connect.publicKey.toString());
    return connect.publicKey.toString();

    // @ts-ignore
    const req = await provider.request({ method: "connect" });
    console.log("req", req);
    return req.publicKey.toString();
  }, []);
}

export function useSignPhantomPayout(): (
  toAddress: string,
  amount: number
) => Promise<RpcResponseAndContext<SignatureResult>> {
  return useCallback(async () => {
    // @ts-ignore
    // const provider = await window.solana;
    const provider = await window.solana;
    const connect = await provider.connect();
    console.log("connect", connect.publicKey.toString());
    
    const NETWORK = clusterApiUrl("mainnet-beta");
    console.log("NETWORK", NETWORK);
    const CONNECTION = new Connection(NETWORK);
    console.log("provider", provider);
    console.log("provider.publicKey", provider.publicKey);
    const transaction = new Transaction().add(
      ...[
        SystemProgram.transfer({
          fromPubkey: provider.publicKey,
          toPubkey: provider.publicKey,
          lamports: solToLamports(0.001),
        }),
      ]
    );
    console.log("transaction", transaction);

    transaction.recentBlockhash = (
      await CONNECTION.getRecentBlockhash()
    ).blockhash;
    transaction.feePayer = provider.publicKey;
    // @ts-ignore
    console.log("before signature");
    const { signature } = await window.solana.signAndSendTransaction(
      transaction
    );
    console.log("signature", signature);
    const tx = await CONNECTION.confirmTransaction(signature);
    return signature;
  }, []);
}

const solToLamports = (sol: number) => {
  return sol * 1000000000;
};
