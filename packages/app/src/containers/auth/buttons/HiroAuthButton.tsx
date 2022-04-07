import React, { FC } from "react";
import { ThreepidSource, UserDetails } from "@dewo/app/graphql/types";
import {
  getThreepidName,
  ThreepidAuthButton,
} from "@dewo/app/containers/auth/buttons/ThreepidAuthButton";
import {
  useAuthWithThreepid,
  useCreateHiroThreepid,
} from "@dewo/app/containers/auth/hooks";
import { useRunningCallback } from "@dewo/app/util/hooks";
import { ButtonProps } from "antd";
import { HiroIcon } from "@dewo/app/components/icons/Hiro";

interface Props extends ButtonProps {
  state?: object;
  onAuthed?(user: UserDetails, threepidId: string): void;
}

export const HiroAuthButton: FC<Props> = ({
  state,
  onAuthed,
  ...buttonProps
}) => {
  const authWithThreepid = useAuthWithThreepid();

  const createHiroThreepid = useCreateHiroThreepid();
  const [handleAuth, authing] = useRunningCallback(async () => {
    try {
      const threepidId = await createHiroThreepid();
      const user = await authWithThreepid(threepidId);
      onAuthed?.(user, threepidId);
    } catch (error) {
      alert((error as Error).message);
      throw error;
    }
  }, [onAuthed, createHiroThreepid, authWithThreepid]);

  return (
    <ThreepidAuthButton
      loading={authing}
      source={ThreepidSource.hiro}
      children={getThreepidName[ThreepidSource.hiro]}
      state={state}
      icon={<HiroIcon />}
      href={undefined}
      onClick={handleAuth}
      {...buttonProps}
    />
  );
};
