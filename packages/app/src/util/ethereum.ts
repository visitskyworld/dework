import { useCallback, useEffect, useMemo, useState } from "react";
import { BigNumber, ethers } from "ethers";
import {
  PaymentNetwork,
  PaymentToken,
  PaymentTokenType,
} from "../graphql/types";

const ethereumChainIdBySlug: Record<string, number> = {
  "ethereum-mainnet": 1,
  "ethereum-rinkeby": 4,
  "sokol-testnet": 77,
  "gnosis-chain": 100,
};

export function useProvider(): ethers.providers.Web3Provider {
  const [chainId, setChainId] = useState<number>(
    // @ts-ignore
    Number(window.ethereum.networkVersion)
  );
  useEffect(() => {
    // @ts-ignore
    window.ethereum.on("chainChanged", (chainIdHex) =>
      setChainId(BigNumber.from(chainIdHex).toNumber())
    );
  }, []);

  return useMemo(
    () =>
      typeof window !== "undefined" &&
      // @ts-ignore
      !!window.ethereum
        ? new ethers.providers.Web3Provider(
            // @ts-ignore
            window.ethereum,
            chainId
          )
        : (undefined! as ethers.providers.Web3Provider),
    [chainId]
  );
}

export function useSwitchChain(): (slug: string) => Promise<void> {
  const provider = useProvider();
  return useCallback(
    async (slug) => {
      const chainId = ethereumChainIdBySlug[slug];
      const networkChangedPromise = new Promise<void>((resolve) => {
        // @ts-ignore
        window.ethereum.on("chainChanged", (chainIdHex) => {
          if (BigNumber.from(chainIdHex).toNumber() === chainId) {
            resolve();
          }
        });
      });

      await provider.send("wallet_switchEthereumChain", [
        { chainId: `0x${chainId.toString(16)}` },
      ]);

      await networkChangedPromise;
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

interface ERC20Contract {
  balanceOf(owner: string): Promise<BigNumber>;
  transfer(
    to: string,
    value: BigNumber
  ): Promise<ethers.providers.TransactionResponse>;
}

export function useERC20Contract(): (
  address: string
) => Promise<ethers.Contract & ERC20Contract> {
  const requestSigner = useRequestSigner();
  return useCallback(
    async (address) => {
      const signer = await requestSigner();
      // https://gist.github.com/petejkim/72421bc2cb26fad916c84864421773a4
      return new ethers.Contract(
        address,
        [
          "function balanceOf(address owner) public view returns (uint256 balance)",
          "function transfer(address to, uint256 value) public returns (bool success)",
        ],
        signer
      ) as ethers.Contract & ERC20Contract;
    },
    [requestSigner]
  );
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
  const loadERC20Contract = useERC20Contract();
  return useCallback(
    async (fromAddress, toAddress, amount, token, network) => {
      const currentAddress = await requestAddress();
      if (currentAddress !== fromAddress) {
        throw new Error(`Change Metamask Wallet address to "${fromAddress}"`);
      }

      await switchNetwork(network.slug);
      const signer = await requestSigner();

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
          const contract = await loadERC20Contract(token.address!);
          const tx = await contract.transfer(toAddress, BigNumber.from(amount));
          return tx.hash;
        default:
          throw new Error(
            `Ethereum payments for tokens type "${token.type}" not implemented`
          );
      }
    },
    [requestAddress, requestSigner, switchNetwork, loadERC20Contract]
  );
}
