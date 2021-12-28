import { useCallback } from "react";
import * as solana from "@solana/web3.js";
import * as spl from "@solana/spl-token";
import {
  PaymentNetwork,
  PaymentToken,
  PaymentTokenType,
} from "../graphql/types";

export function useRequestSigner(): () => Promise<solana.Signer> {
  return useCallback(async () => {
    // @ts-ignore
    const provider = await window.solana;
    const signer = await provider.connect();
    return signer;
  }, []);
}

export function useRequestAddress(): () => Promise<string> {
  const requestSigner = useRequestSigner();
  return useCallback(async () => {
    const signer = await requestSigner();
    return signer.publicKey.toString();
  }, [requestSigner]);
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
  return useCallback(
    async (fromAddress, toAddress, amount, token, network) => {
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

      // @ts-ignore
      const { signature } = await window.solana.signAndSendTransaction(
        transaction
      );
      return signature;
    },
    [requestAddress, requestSigner]
  );
}
