import { useCallback, useMemo } from "react";
import { BigNumber, ethers } from "ethers";
import {
  PaymentNetwork,
  PaymentToken,
  PaymentTokenType,
} from "../graphql/types";

const ethereumChainIdBySlug: Record<string, number> = {
  "ethereum-mainnet": 1,
  "ethereum-rinkeby": 4,
};

export function useProvider(): ethers.providers.Web3Provider {
  return useMemo(
    () =>
      typeof window !== "undefined" &&
      // @ts-ignore
      !!window.ethereum
        ? new ethers.providers.Web3Provider(
            // @ts-ignore
            window.ethereum
          )
        : (undefined! as ethers.providers.Web3Provider),
    []
  );
}

export function useSwitchChain(): (slug: string) => Promise<void> {
  const provider = useProvider();
  return useCallback(
    async (slug) => {
      const chainId = ethereumChainIdBySlug[slug];
      await provider.send("wallet_switchEthereumChain", [
        { chainId: `0x${chainId}` },
      ]);
    },
    [provider]
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

export function useCreateEthereumTransaction(): (
  fromAddress: string,
  toAddress: string,
  amount: string,
  token: PaymentToken,
  network: PaymentNetwork
) => Promise<string> {
  const requestAddress = useRequestAddress();
  const requestSigner = useRequestSigner();
  const switchNetwork = useSwitchChain();
  return useCallback(
    async (fromAddress, toAddress, amount, token, network) => {
      const currentAddress = await requestAddress();
      if (currentAddress !== fromAddress) {
        throw new Error(`Change Metamask Wallet address to "${fromAddress}"`);
      }

      const signer = await requestSigner();
      await switchNetwork(network.slug);

      switch (token.type) {
        case PaymentTokenType.ETHER: {
          const tx = await signer.sendTransaction({
            to: toAddress,
            from: fromAddress,
            value: BigNumber.from(amount),
          });
          return tx.hash;
        }
        case PaymentTokenType.ERC20:
          // https://gist.github.com/petejkim/72421bc2cb26fad916c84864421773a4
          const erc20Contract = new ethers.Contract(
            token.address!,
            [
              "function transfer(address to, uint256 value) public returns (bool success)",
            ],
            signer
          );
          const tx = await erc20Contract.transfer(
            toAddress,
            BigNumber.from(amount)
          );
          return tx.hash;
        default:
          throw new Error(
            `Ethereum payments for tokens type "${token.type}" not implemented`
          );
      }
    },
    [requestAddress, requestSigner, switchNetwork]
  );
}
