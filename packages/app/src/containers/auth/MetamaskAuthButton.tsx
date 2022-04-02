import React, { FC } from "react";
import { ThreepidSource, UserDetails } from "@dewo/app/graphql/types";
import { getThreepidName, ThreepidAuthButton } from "./ThreepidAuthButton";
import { useAuthWithThreepid, useCreateMetamaskThreepid } from "./hooks";
import { useRunningCallback } from "@dewo/app/util/hooks";
import { ButtonProps } from "antd";
import { MetamaskIcon } from "@dewo/app/components/icons/Metamask";

interface Props extends ButtonProps {
  state?: object;
  onAuthed?(user: UserDetails, threepidId: string): void;
}

export const MetamaskAuthButton: FC<Props> = ({
  state,
  onAuthed,
  ...buttonProps
}) => {
  const authWithThreepid = useAuthWithThreepid();

  const createMetamaskThreepid = useCreateMetamaskThreepid();
  const [authWithMetamask, authingWithMetamask] =
    useRunningCallback(async () => {
      try {
        const threepidId = await createMetamaskThreepid();
        const user = await authWithThreepid(threepidId);
        onAuthed?.(user, threepidId);
      } catch (error) {
        alert((error as Error).message);
        throw error;
      }
    }, [createMetamaskThreepid, authWithThreepid, onAuthed]);

  return (
    <ThreepidAuthButton
      loading={authingWithMetamask}
      source={ThreepidSource.metamask}
      children={getThreepidName[ThreepidSource.metamask]}
      state={state}
      icon={<MetamaskIcon />}
      href={undefined}
      onClick={authWithMetamask}
      {...buttonProps}
    />
  );
};
