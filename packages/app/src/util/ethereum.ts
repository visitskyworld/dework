import { MutableRefObject, useCallback, useEffect, useRef } from "react";
import {
  BigNumber as TBigNumber,
  Contract as TContract,
  providers,
  Signer,
} from "ethers";
import {
  PaymentNetwork,
  PaymentToken,
  PaymentTokenType,
} from "../graphql/types";
import detectEthereumProvider from "@metamask/detect-provider";

export function useProvider(): MutableRefObject<providers.Web3Provider> {
  const provider = useRef<providers.Web3Provider>();
  const loadProvider = useCallback(async () => {
    const ethereum = await detectEthereumProvider();
    if (!!ethereum) {
      provider.current = new providers.Web3Provider(ethereum as any);
    }
  }, []);

  useEffect(() => {
    // @ts-ignore
    window.ethereum?.on("chainChanged", loadProvider);
  }, [loadProvider]);

  useEffect(() => {
    loadProvider();
  }, [loadProvider]);

  return provider as MutableRefObject<providers.Web3Provider>;
}

export function useSwitchChain(): (network: PaymentNetwork) => Promise<void> {
  const provider = useProvider();
  return useCallback(
    async (network) => {
      const { BigNumber } = await import("ethers");

      const chainId = network.config.chainId as number;
      const currentNetwork = await provider.current.getNetwork();
      if (currentNetwork.chainId === chainId) {
        return;
      }

      const networkChangedPromise = new Promise<void>((resolve) => {
        // @ts-ignore
        window.ethereum.on("chainChanged", (chainIdHex) => {
          if (BigNumber.from(chainIdHex).toNumber() === chainId) {
            resolve();
          }
        });
      });

      await provider.current.send("wallet_switchEthereumChain", [
        { chainId: `0x${chainId.toString(16)}` },
      ]);

      await networkChangedPromise;
    },
    [provider]
  );
}

export function useRequestSigner(): () => Promise<Signer> {
  const provider = useProvider();
  return useCallback(async () => {
    await provider.current.send("eth_requestAccounts", []);
    return provider.current.getSigner();
  }, [provider]);
}

export function useRequestAddress(): () => Promise<string> {
  const requestSigner = useRequestSigner();
  return useCallback(async () => {
    const signer = await requestSigner();
    return signer.getAddress();
  }, [requestSigner]);
}

export function usePersonalSign(): (
  message: string,
  address: string
) => Promise<string> {
  const provider = useProvider();
  return useCallback(
    async (message, address) => {
      return provider.current.send("personal_sign", [message, address]);
    },
    [provider]
  );
}

interface ERC20Contract {
  balanceOf(owner: string): Promise<TBigNumber>;
  name(): Promise<string>;
  symbol(): Promise<string>;
  decimals(): Promise<number>;
  transfer(
    to: string,
    value: TBigNumber
  ): Promise<providers.TransactionResponse>;
}

interface ERC721Contract {
  balanceOf(owner: string): Promise<TBigNumber>;
  name(): Promise<string>;
  symbol(): Promise<string>;
  transferFrom(
    from: string,
    to: string,
    value: TBigNumber
  ): Promise<providers.TransactionResponse>;
}

interface ERC1155Contract {
  balanceOf(owner: string, id: number): Promise<TBigNumber>;
  uri(id: number): Promise<string>;
  safeTransferFrom(
    from: string,
    to: string,
    id: TBigNumber,
    amount: TBigNumber,
    data: TBigNumber
  ): Promise<providers.TransactionResponse>;
}

export function useERC20Contract(): (
  address: string,
  network: PaymentNetwork
) => Promise<TContract & ERC20Contract> {
  const requestSigner = useRequestSigner();
  const switchChain = useSwitchChain();
  return useCallback(
    async (address, network) => {
      const { Contract } = await import("ethers");
      await switchChain(network);
      const signer = await requestSigner();
      // https://gist.github.com/petejkim/72421bc2cb26fad916c84864421773a4
      return new Contract(
        address,
        [
          "function balanceOf(address owner) public view returns (uint256 balance)",
          "function transfer(address to, uint256 value) public returns (bool success)",
          "function name() public view returns (string memory)",
          "function symbol() public view returns (string memory)",
          "function decimals() public view returns (uint8)",
        ],
        signer
      ) as TContract & ERC20Contract;
    },
    [requestSigner, switchChain]
  );
}

export function useERC721Contract(): (
  address: string,
  network: PaymentNetwork
) => Promise<TContract & ERC721Contract> {
  const requestSigner = useRequestSigner();
  const switchChain = useSwitchChain();
  return useCallback(
    async (address, network) => {
      const { Contract } = await import("ethers");
      await switchChain(network);
      const signer = await requestSigner();
      return new Contract(
        address,
        [
          "function balanceOf(address owner) public view returns (uint256 balance)",
          "function name() public view returns (string memory)",
          "function symbol() public view returns (string memory)",
          "function transferFrom(address from, address to, uint256 tokenId) public",
        ],
        signer
      ) as TContract & ERC721Contract;
    },
    [requestSigner, switchChain]
  );
}

export function useERC1155Contract(): (
  address: string,
  network: PaymentNetwork
) => Promise<TContract & ERC1155Contract> {
  const requestSigner = useRequestSigner();
  const switchChain = useSwitchChain();
  return useCallback(
    async (address, network) => {
      const { Contract } = await import("ethers");
      await switchChain(network);
      const signer = await requestSigner();
      return new Contract(
        address,
        [
          "function balanceOf(address owner, uint256 id) public view returns (uint256 balance)",
          "function uri(uint256 id) public view returns (string memory)",
          "function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) public",
        ],
        signer
      ) as TContract & ERC1155Contract;
    },
    [requestSigner, switchChain]
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
  const switchChain = useSwitchChain();
  const loadERC20Contract = useERC20Contract();
  const loadERC721Contract = useERC721Contract();
  const loadERC1155Contract = useERC1155Contract();
  return useCallback(
    async (fromAddress, toAddress, amount, token, network) => {
      const { BigNumber } = await import("ethers");
      const currentAddress = await requestAddress();
      if (currentAddress !== fromAddress) {
        throw new Error(`Change Metamask Wallet address to "${fromAddress}"`);
      }

      await switchChain(network);
      const signer = await requestSigner();

      switch (token.type) {
        case PaymentTokenType.NATIVE: {
          const tx = await signer.sendTransaction({
            to: toAddress,
            from: fromAddress,
            value: BigNumber.from(amount),
          });
          return tx.hash;
        }
        case PaymentTokenType.ERC20: {
          const contract = await loadERC20Contract(token.address!, network);
          const tx = await contract.transfer(toAddress, BigNumber.from(amount));
          return tx.hash;
        }
        case PaymentTokenType.ERC721: {
          const contract = await loadERC721Contract(token.address!, network);
          const tx = await contract.transferFrom(
            fromAddress,
            toAddress,
            BigNumber.from(amount)
          );
          return tx.hash;
        }
        case PaymentTokenType.ERC1155: {
          const contract = await loadERC1155Contract(token.address!, network);
          const tx = await contract.safeTransferFrom(
            fromAddress,
            toAddress,
            BigNumber.from(token.identifier!),
            BigNumber.from(amount),
            BigNumber.from(0)
          );
          return tx.hash;
        }
        default:
          throw new Error(
            `Ethereum payments for tokens type "${token.type}" not implemented`
          );
      }
    },
    [
      requestAddress,
      requestSigner,
      switchChain,
      loadERC20Contract,
      loadERC721Contract,
      loadERC1155Contract,
    ]
  );
}
