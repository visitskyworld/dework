import React, { MutableRefObject, useCallback, useEffect, useRef } from "react";
import { BigNumber, ethers } from "ethers";
import {
  PaymentNetwork,
  PaymentToken,
  PaymentTokenType,
} from "../graphql/types";
import detectEthereumProvider from "@metamask/detect-provider";
import { ISessionParams } from "@walletconnect/types";
import { useWalletConnect } from "../contexts/WalletConnectContext";
import { Modal } from "antd";
import { convertUtf8ToHex } from "@walletconnect/utils";
import { MetamaskIcon } from "../components/icons/Metamask";

export function useProvider(): MutableRefObject<ethers.providers.Web3Provider> {
  const provider = useRef<ethers.providers.Web3Provider>();
  const loadProvider = useCallback(async () => {
    const ethereum = await detectEthereumProvider();
    if (!!ethereum) {
      // provider.current = new ethers.providers.Web3Provider(ethereum as any);
    } else {
      // let destroyModal: () => void;
      // const walletConnectProvider = new WalletConnectProvider({
      //   infuraId: "433fc1b200c5458ebd548093da9135d8",
      //   qrcodeModal: {
      //     open: (uri) => {
      //       ({ destroy: destroyModal } = Modal.confirm({
      //         title: "Open Metamask",
      //         onOk: () => window.open(uri),
      //       }));
      //     },
      //     close: () => destroyModal?.(),
      //   },
      // }) as any;
      // alert("wow: " + provider.current.send);
      // if (walletConnectProvider.wc.connected) {
      //   try {
      //     await walletConnectProvider.wc.killSession();
      //   } catch (error) {
      //     alert("error");
      //   }
      // }
      // walletConnectProvider.wc.on("display_uri", (...args) =>
      //   alert("dasply url: " + JSON.stringify(args, null, 2))
      // );
      // provider.current = walletConnectWeb3Provider;
    }
  }, []);

  useEffect(() => {
    // @ts-ignore
    window.ethereum?.on("chainChanged", loadProvider);
  }, [loadProvider]);

  useEffect(() => {
    loadProvider();
  }, [loadProvider]);

  return provider as MutableRefObject<ethers.providers.Web3Provider>;
}

export function useSwitchChain(): (network: PaymentNetwork) => Promise<void> {
  const provider = useProvider();
  return useCallback(
    async (network) => {
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

export function useRequestSigner(): () => Promise<ethers.Signer> {
  const provider = useProvider();
  return useCallback(async () => {
    await provider.current.send("eth_requestAccounts", []);
    return provider.current.getSigner();
  }, [provider]);
}

export function useRequestAddress(): () => Promise<string> {
  const provider = useProvider();
  const walletConnect = useWalletConnect();
  const requestSigner = useRequestSigner();
  return useCallback(async () => {
    if (provider.current) {
      const signer = await requestSigner();
      return signer.getAddress();
    } else {
      if (walletConnect.connector.connected) {
        await walletConnect.connector.killSession();
        // return walletConnect.connector.accounts[0];
      }

      await walletConnect.connector.createSession();
      alert(
        JSON.stringify({
          handshakeId: walletConnect.connector.handshakeId,
          handshakeTopic: walletConnect.connector.handshakeTopic,
        })
      );
      const payload = await new Promise<{ params: ISessionParams[] }>(
        (resolve, reject) => {
          walletConnect.connector.on("connect", (error, payload) =>
            !!error ? reject(error) : resolve(payload)
          );
        }
      );

      const address = payload.params[0]?.accounts?.[0];
      if (!!address) return address;
      throw new Error("Failed to connect with WalletConnect");
    }
  }, [requestSigner, provider, walletConnect]);
}

export function usePersonalSign(): (
  message: string,
  address: string
) => Promise<string> {
  const provider = useProvider();
  const walletConnect = useWalletConnect();
  return useCallback(
    async (message, address) => {
      if (provider.current) {
        return provider.current.send("personal_sign", [message, address]);
      } else {
        return new Promise(async (resolve, reject) => {
          const modal = Modal.confirm({
            icon: <MetamaskIcon />,
            title: "Step 2: Sign Message", // (by manually opening Metamask again)",
            // okText: "Awaiting confirmation",
            okText: "Open Metamask",
            // okButtonProps: { loading: true, disabled: true },
            onOk: async () => {
              window.open("https://metamask.app.link");
              modal.destroy();
            },
            onCancel: () => {
              modal.destroy();
              reject(new Error("User cancelled signing message"));
            },
          });

          const signature = await walletConnect.connector.signPersonalMessage([
            convertUtf8ToHex(message),
            address,
          ]);
          modal.destroy();
          resolve(signature);
        });
      }
    },
    [provider, walletConnect]
  );
}

interface ERC20Contract {
  balanceOf(owner: string): Promise<BigNumber>;
  name(): Promise<string>;
  symbol(): Promise<string>;
  decimals(): Promise<number>;
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
          "function name() public view returns (string memory)",
          "function symbol() public view returns (string memory)",
          "function decimals() public view returns (uint8)",
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
  const switchChain = useSwitchChain();
  const loadERC20Contract = useERC20Contract();
  return useCallback(
    async (fromAddress, toAddress, amount, token, network) => {
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
    [requestAddress, requestSigner, switchChain, loadERC20Contract]
  );
}
