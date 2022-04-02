import { useCallback, useEffect, useState } from "react";
import { SignaturePubkeyPair, Signer, Transaction } from "@solana/web3.js";
import {
  PaymentNetwork,
  PaymentToken,
  PaymentTokenType,
} from "../graphql/types";

interface PhantomSolana {
  connect: () => Promise<Signer>;
  signAndSendTransaction: (
    transaction: Transaction
  ) => Promise<{ signature: any }>;
  signMessage: (
    message: Uint8Array,
    encoding: string
  ) => Promise<SignaturePubkeyPair>;
}

export function useProvider() {
  const [provider, setProvider] = useState<PhantomSolana | undefined>();
  useEffect(() => {
    const fn = async () => {
      if ("solana" in window) {
        // @ts-ignore
        const phantom = (await window.solana) as PhantomSolana;
        setProvider(phantom);
      }
    };
    fn();
  }, []);
  return provider;
}

export function useRequestSigner() {
  const provider = useProvider();
  return useCallback(async () => {
    if (provider) {
      return await provider.connect();
    }
    throw new Error("Phantom is not connected");
  }, [provider]);
}

export function useRequestAddress(): () => Promise<string> {
  const requestSigner = useRequestSigner();
  return useCallback(async () => {
    const kp = await requestSigner();
    return kp.publicKey.toString();
  }, [requestSigner]);
}

export function usePersonalSign() {
  const provider = useProvider();
  return useCallback(
    async (message) => {
      if (!provider) {
        throw new Error("Phantom is not connected");
      }
      const encodedMessage = new TextEncoder().encode(message);
      const signedMessage = await provider.signMessage(encodedMessage, "utf8");
      return signedMessage.signature;
    },
    [provider]
  );
}

export function useCreateSolanaTransaction(): (
  fromAddress: string,
  toAddress: string,
  amount: number,
  token: PaymentToken,
  network: PaymentNetwork
) => Promise<string> {
  const requestAddress = useRequestAddress();
  const requestSigner = useRequestSigner();
  const provider = useProvider();
  return useCallback(
    async (fromAddress, toAddress, amount, token, network) => {
      if (!provider) {
        throw new Error("Phantom is not connected");
      }

      const solana = await import("@solana/web3.js");
      const spl = await import("@solana/spl-token");

      const currentAddress = await requestAddress();
      if (currentAddress !== fromAddress) {
        throw new Error(`Change Phantom Wallet address to "${fromAddress}"`);
      }

      const fromPubkey = new solana.PublicKey(fromAddress);
      const toPubkey = new solana.PublicKey(toAddress);
      const connection = new solana.Connection(network.config.rpcUrl);
      const recentBlock = await connection.getRecentBlockhash();
      const transaction = new solana.Transaction({
        recentBlockhash: recentBlock.blockhash,
        feePayer: fromPubkey,
      });

      switch (token.type) {
        case PaymentTokenType.NATIVE: {
          transaction.add(
            solana.SystemProgram.transfer({
              fromPubkey,
              toPubkey,
              lamports: amount,
            })
          );
          break;
        }
        case PaymentTokenType.SPL_TOKEN: {
          // https://stackoverflow.com/questions/68236211/how-to-transfer-custom-token-by-solana-web3-js
          const signer = await requestSigner();

          const mintPublicKey = new solana.PublicKey(token.address!);
          const mintToken = new spl.Token(
            connection,
            mintPublicKey,
            spl.TOKEN_PROGRAM_ID,
            signer
          );
          const fromTokenAccount =
            await mintToken.getOrCreateAssociatedAccountInfo(fromPubkey);

          const associatedDestinationTokenAddr =
            await spl.Token.getAssociatedTokenAddress(
              mintToken.associatedProgramId,
              mintToken.programId,
              mintPublicKey,
              toPubkey
            );

          const receiverAccount = await connection.getAccountInfo(
            associatedDestinationTokenAddr
          );

          if (!receiverAccount) {
            transaction.add(
              spl.Token.createAssociatedTokenAccountInstruction(
                mintToken.associatedProgramId,
                mintToken.programId,
                mintPublicKey,
                associatedDestinationTokenAddr,
                toPubkey,
                signer.publicKey
              )
            );
          }

          transaction.add(
            spl.Token.createTransferInstruction(
              spl.TOKEN_PROGRAM_ID,
              fromTokenAccount.address,
              associatedDestinationTokenAddr,
              signer.publicKey,
              [],
              amount
            )
          );

          break;
        }
        default:
          throw new Error(
            `Solana payments for tokens type "${token.type}" not implemented`
          );
      }

      const { signature } = await provider.signAndSendTransaction(transaction);
      return signature;
    },
    [provider, requestAddress, requestSigner]
  );
}
