import { PhantomIcon } from "@dewo/app/components/icons/Phantom";
import { ThreepidSource, UserDetails } from "@dewo/app/graphql/types";
import { useRunningCallback } from "@dewo/app/util/hooks";
import { ButtonProps } from "antd";
import React, { FC } from "react";
import { useAuthWithThreepid, useCreatePhantomThreepid } from "../hooks";
import { getThreepidName, ThreepidAuthButton } from "./ThreepidAuthButton";

interface Props extends ButtonProps {
  state?: object;
  onAuthed?(user: UserDetails, threepidId: string): void;
}

export const PhantomAuthButton: FC<Props> = ({
  state,
  onAuthed,
  ...buttonProps
}) => {
  const authWithThreepid = useAuthWithThreepid();

  const createPhantomThreepid = useCreatePhantomThreepid();
  const [authWithPhantom, authingWithPhantom] = useRunningCallback(async () => {
    try {
      const threepidId = await createPhantomThreepid();
      const user = await authWithThreepid(threepidId);
      onAuthed?.(user, threepidId);
    } catch (error) {
      alert((error as Error).message);
      throw error;
    }
  }, [createPhantomThreepid, authWithThreepid, onAuthed]);
  return (
    <ThreepidAuthButton
      loading={authingWithPhantom}
      source={ThreepidSource.phantom}
      children={getThreepidName[ThreepidSource.phantom]}
      state={state}
      icon={<PhantomIcon />}
      href={undefined}
      onClick={authWithPhantom}
      {...buttonProps}
    />
  );
};
