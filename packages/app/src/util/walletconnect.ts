import { useCallback } from "react";

export const useWalletConnector = () => {
  return useCallback(async () => {
    const [{ default: WalletConnect }, { default: QRCodeModal }] =
      await Promise.all([
        import("@walletconnect/client"),
        import("@walletconnect/qrcode-modal"),
      ]);

    return new WalletConnect({
      bridge: "https://bridge.walletconnect.org", // Required
      qrcodeModal: QRCodeModal,
      qrcodeModalOptions: { desktopLinks: [] },
    });
  }, []);
};

export const useWalletConnectAddress = () => {
  const loadConnector = useWalletConnector();

  return useCallback(async () => {
    const [connector, { default: QRCodeModal }] = await Promise.all([
      loadConnector(),
      import("@walletconnect/qrcode-modal"),
    ]);
    if (!connector.connected) {
      connector.createSession();
    } else {
      await new Promise((res) =>
        QRCodeModal.open(connector.uri, res, { desktopLinks: [] })
      );
    }

    const address = await new Promise<string>((res, rej) => {
      const func = async (error: Error | null, payload: any) => {
        if (error) {
          rej(error);
        }
        const { accounts } = payload.params[0];
        const account = accounts[0] as string;
        res(account);
      };
      connector.on("connect", func);
      connector.on("session_update", func);
    });
    // Disconnect event handlers
    connector.off("connect");
    connector.off("session_update");

    return address;
  }, [loadConnector]);
};
