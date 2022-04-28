import { WalletConnectIcon } from "@dewo/app/components/icons/WalletConnect";
import { ThreepidSource, UserDetails } from "@dewo/app/graphql/types";
import { useRunning } from "@dewo/app/util/hooks";
import { useWalletConnectAddress } from "@dewo/app/util/walletconnect";
import { ButtonProps, message } from "antd";
import React, { FC, useCallback } from "react";
import { useAuthWithThreepid, useCreateWalletConnectThreepid } from "../hooks";
import { ThreepidAuthButton } from "./ThreepidAuthButton";

interface Props extends ButtonProps {
  state?: object;
  onAuthed?(user: UserDetails, threepidId: string): void;
}

export const WalletConnectButton: FC<Props> = ({
  state,
  onAuthed,
  ...buttonProps
}) => {
  const createWalletConnectThreepid = useCreateWalletConnectThreepid();
  const authWithThreepid = useAuthWithThreepid();

  const [authWithAddress, authing] = useRunning(
    useCallback(
      async (address: string) => {
        const threepid = await createWalletConnectThreepid(address);
        const userDetails = await authWithThreepid(threepid);
        return { threepid, userDetails };
      },
      [authWithThreepid, createWalletConnectThreepid]
    )
  );

  const getAddress = useWalletConnectAddress();

  const handleClick = useCallback(async () => {
    const address = await getAddress().catch(() => null);
    if (!address) return;
    try {
      const { threepid, userDetails } = await authWithAddress(address);
      onAuthed?.(userDetails, threepid);
    } catch (e) {
      console.error(e);
      message.error(
        "Signature failed. Please try again and sign the message from your wallet."
      );
    }
  }, [authWithAddress, getAddress, onAuthed]);

  return (
    <ThreepidAuthButton
      loading={authing}
      source={ThreepidSource.metamask}
      state={state}
      icon={<WalletConnectIcon />}
      href={undefined}
      onClick={handleClick}
      {...buttonProps}
    />
  );
};
