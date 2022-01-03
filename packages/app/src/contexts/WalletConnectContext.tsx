import React, { createContext, useContext } from "react";
import WalletConnect from "@walletconnect/client";
import { Modal } from "antd";
import { MetamaskIcon } from "../components/icons/Metamask";

const connector = new WalletConnect({
  bridge: "https://bridge.walletconnect.org",
  qrcodeModal: {
    open: () => openModal(),
    close: () => null,
  },
});

function openModal() {
  const modal = Modal.confirm({
    icon: <MetamaskIcon />,
    title: "Step 1: Connect Metamask",
    okText: "Open Metamask",
    onOk: () => {
      window.open(connector.uri);
      modal.destroy();
    },
    onCancel: () => modal.destroy(),
  });
}

interface WalletConnectContextValue {
  connector: WalletConnect;
  openModal(): void;
}

const WalletConnectContext = createContext<WalletConnectContextValue>({
  connector,
  openModal,
});

export function useWalletConnect(): WalletConnectContextValue {
  return useContext(WalletConnectContext);
}
