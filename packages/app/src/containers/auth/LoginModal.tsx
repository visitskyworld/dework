import React, { FC, useCallback, useMemo } from "react";
import { Modal, Space } from "antd";
import { useRouter } from "next/router";
import MobileDetect from "mobile-detect";
import { ThreepidSource } from "@dewo/app/graphql/types";
import {
  getThreepidName,
  ThreepidAuthButton,
} from "@dewo/app/containers/auth/ThreepidAuthButton";
import { useCreateMetamaskThreepid } from "@dewo/app/containers/auth/hooks";
import { useToggle, UseToggleHook } from "@dewo/app/util/hooks";
import { useProvider } from "@dewo/app/util/ethereum";
import WalletConnect from "@walletconnect/client";

// import WalletConnectClient, { CLIENT_EVENTS } from "@walletconnect/client";
// import { PairingTypes } from "@walletconnect/types";

interface Props {
  toggle: UseToggleHook;
}

let wcUri: string;

const connector = new WalletConnect({
  bridge: "https://bridge.walletconnect.org",
  clientMeta: {
    name: "Dework",
    description: "The task manager for DAOs and decentralized work",
    url: "https://dework.xyz",
    icons: ["https://walletconnect.org/walletconnect-logo.png"],
  },
});

connector.on("connect", (error, payload) => {
  if (error) {
    throw error;
  }

  alert(JSON.stringify(payload.params[0], null, 2));

  connector.signPersonalMessage([
    "that became personal to me",
    payload.params[0].accounts[0],
  ]);
});

connector.on("*", (...args) => alert(JSON.stringify(args, null, 2)));

// if (connector.connected) {
//   // connector.killSession();
//   // alert("already connected: " + connector.uri);
//   connector.killSession().then(() => {
//     // connector.createSession();
//   });
// } else {
//   connector.createSession();
// }

const signP = connector.signPersonalMessage([
  "that became personal to me",
  connector.session.accounts[0],
]);

export const LoginModal: FC<Props> = ({ toggle }) => {
  const router = useRouter();
  const appUrl = typeof window !== "undefined" ? window.location.origin : "";
  const state = useMemo(
    () => ({ ...router.query, redirect: router.asPath, appUrl }),
    [router.query, router.asPath, appUrl]
  );

  const isMetamaskAvailable = !!useProvider().current;
  const authingWithMetamask = useToggle();
  const createMetamaskThreepid = useCreateMetamaskThreepid();
  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    const md = new MobileDetect(window.navigator.userAgent);
    return md.is("iOS") || md.is("AndroidOS");
  }, []);

  const authWithMetamask = useCallback(async () => {
    if (Math.random()) {
      const metamaskUri = `https://metamask.app.link/wc?uri=${encodeURIComponent(
        connector.uri
      )}`;

      alert(connector.connected);
      if (!connector.connected) {
        const sessionP = null; // connector.createSession();
        window.open(metamaskUri);
        const session = await sessionP;
        alert(JSON.stringify(session, null, 2));
      } else {
        // const resP = connector.signPersonalMessage([
        //   connector.session.accounts[0],
        //   "that became personal to me",
        // ]);
        window.open(metamaskUri);
        const res = await signP;
        alert(JSON.stringify(res, null, 2));
      }

      // if (!connector.connected) {
      // } else {
      //   try {

      //     alert(JSON.stringify(res, null, 2));
      //   } catch (error) {
      //     alert(JSON.stringify(error, null, 2));
      //   }
      // }

      // alert(JSON.stringify(session, null, 2));
      // window.open(wcUri, "_blank");
      // window.open(
      //   "https://metamask.app.link/wc?uri=wc%3A3833532d-50b1-4f30-bc21-ee424e52ff44%401%3Fbridge%3Dhttps%253A%252F%252Fj.bridge.walletconnect.org%26key%3D7970cc77571e472b26fdc5f388fdb1f5ba02b55d817589b7d5f70e5528ea741a",
      //   "_blank"
      // );

      return;
    }

    if (!isMetamaskAvailable) {
      window.open(
        `https://metamask.app.link/dapp/${window.location.hostname}/${window.location.pathname}`
      );
      return;
    }

    try {
      authingWithMetamask.toggleOn();
      const threepidId = await createMetamaskThreepid();
      await router.push(
        `/auth/3pid/${threepidId}?state=${JSON.stringify(state)}`
      );
    } catch (error) {
      alert((error as Error).message);
    } finally {
      authingWithMetamask.toggleOff();
    }
  }, [
    createMetamaskThreepid,
    router,
    state,
    authingWithMetamask,
    isMetamaskAvailable,
  ]);

  const showMetamaskPrompt = isMobile && !isMetamaskAvailable;
  return (
    <Modal
      visible={toggle.isOn}
      footer={null}
      title="Connect"
      width={368}
      onCancel={toggle.toggleOff}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        {/* <Popconfirm
          title="To connect with Metamask on mobile, open the Metamask app, go to the browser tab, and open dework.xyz"
          disabled={!showMetamaskPrompt}
          okText="Open Metamask"
          onConfirm={authWithMetamask}
          style={{ maxWidth: 120 }}
        > */}
        <ThreepidAuthButton
          loading={authingWithMetamask.isOn}
          source={ThreepidSource.metamask}
          children={getThreepidName[ThreepidSource.metamask]}
          size="large"
          type="ghost"
          block
          state={state}
          href={undefined}
          // onClick={showMetamaskPrompt ? undefined : authWithMetamask}
          onClick={authWithMetamask}
        />
        {/* </Popconfirm> */}
        <ThreepidAuthButton
          source={ThreepidSource.discord}
          children={getThreepidName[ThreepidSource.discord]}
          size="large"
          type="ghost"
          block
          state={state}
        />
        <ThreepidAuthButton
          source={ThreepidSource.github}
          children={getThreepidName[ThreepidSource.github]}
          size="large"
          type="ghost"
          block
          state={state}
        />
      </Space>
    </Modal>
  );
};
