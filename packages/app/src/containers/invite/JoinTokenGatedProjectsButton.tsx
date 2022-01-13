import { Button } from "antd";
import React, { FC, useMemo } from "react";
import { useOrganization } from "../organization/hooks";
import * as Icons from "@ant-design/icons";
import { useCurrentUser, useToggle } from "@dewo/app/util/hooks";
import _ from "lodash";
import { LoginButton } from "../auth/LoginButton";
import { JoinTokenGatedProjectsModal } from "./JoinTokenGatedProjectsModal";

interface Props {
  organizationId: string;
}

export const JoinTokenGatedProjectsButton: FC<Props> = ({ organizationId }) => {
  const modalVisible = useToggle();
  const user = useCurrentUser();

  const { organization, refetch } = useOrganization(organizationId);

  const invites = useMemo(
    () =>
      organization?.tokenGatedInvites
        .filter((invite) => !!invite.project)
        .filter(
          (i) => !organization.projects.some((p) => p.id === i.project!.id)
        ),
    [organization]
  );

  const tokens = useMemo(
    () =>
      _(invites)
        .map((i) => i.token!)
        .uniqBy((t) => t.id)
        .value(),
    [invites]
  );

  if (!invites?.length) return null;
  const buttonText = `Join private projects using ${tokens
    .map((t) => t.symbol)
    .join(", ")}`;
  return (
    <>
      {!!user ? (
        <Button
          type="primary"
          icon={<Icons.LockOutlined />}
          onClick={modalVisible.toggleOn}
        >
          {buttonText}
        </Button>
      ) : (
        <LoginButton type="primary" icon={<Icons.LockOutlined />}>
          {buttonText}
        </LoginButton>
      )}
      {!!user && (
        <JoinTokenGatedProjectsModal
          invites={invites}
          visible={modalVisible.isOn}
          onClose={modalVisible.toggleOff}
          onDone={refetch}
        />
      )}
    </>
  );
};
