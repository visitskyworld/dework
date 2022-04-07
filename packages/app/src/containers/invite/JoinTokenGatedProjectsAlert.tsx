import { Alert, Button, message } from "antd";
import React, { FC, useCallback, useMemo } from "react";
import * as Icons from "@ant-design/icons";
import { useToggle } from "@dewo/app/util/hooks";
import { LoginButton } from "../auth/buttons/LoginButton";
import { JoinTokenGatedProjectsModal } from "./JoinTokenGatedProjectsModal";
import { ProjectTokenGate } from "@dewo/app/graphql/types";
import { useJoinProjectWithToken } from "./hooks";
import _ from "lodash";
import { UserProfileFormModal } from "../user/UserProfileFormModal";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { useOrganizationDetails } from "../organization/hooks";

interface Props {
  organizationId: string;
}

export const JoinTokenGatedProjectsAlert: FC<Props> = ({ organizationId }) => {
  const modalVisible = useToggle();
  const editingProfile = useToggle();
  const { user } = useAuthContext();
  const { organization, refetch } = useOrganizationDetails(organizationId);

  const tokenGates = useMemo(
    () =>
      organization?.projectTokenGates?.filter(
        (g) => !organization.projects.some((p) => p.id === g.projectId)
      ),
    [organization?.projectTokenGates, organization?.projects]
  );
  const tokens = useMemo(
    () =>
      _(tokenGates)
        .map((t) => t.token)
        .uniqBy((t) => t.id)
        .value(),
    [tokenGates]
  );

  const joinProjectWithToken = useJoinProjectWithToken();
  const verifyProjectsWithToken = useCallback(
    async (token: ProjectTokenGate["token"]) => {
      const projectIds =
        tokenGates
          ?.filter((t) => t.token.id === token.id)
          .map((t) => t.projectId) ?? [];
      try {
        for (const projectId of projectIds) {
          const project = await joinProjectWithToken(projectId);
          message.success(`Joined ${project.name} using ${token.symbol}`);
        }
      } finally {
        await refetch();
        modalVisible.toggleOff();
      }
    },
    [tokenGates, refetch, joinProjectWithToken, modalVisible]
  );

  const handleProfileSaved = useCallback(() => {
    modalVisible.toggleOn();
    editingProfile.toggleOff();
  }, [modalVisible, editingProfile]);

  if (!tokenGates?.length) return null;

  const tokensString = tokens.map((t) => t.symbol).join(", ");
  return (
    <>
      <Alert
        message={`There are private projects that you can access by authenticating using ${tokensString}`}
        type="info"
        description={
          !!user ? (
            <Button
              type="primary"
              icon={<Icons.LockOutlined />}
              onClick={modalVisible.toggleOn}
            >
              Join
            </Button>
          ) : (
            <LoginButton
              type="primary"
              icon={<Icons.LockOutlined />}
              onAuthedWithWallet={editingProfile.toggleOn}
            >
              Join
            </LoginButton>
          )
        }
        showIcon
      />
      {!!user && (
        <JoinTokenGatedProjectsModal
          tokens={tokens}
          visible={modalVisible.isOn}
          onClose={modalVisible.toggleOff}
          onVerify={verifyProjectsWithToken}
        />
      )}
      {!!user && (
        <UserProfileFormModal
          visible={editingProfile.isOn}
          onDone={handleProfileSaved}
        />
      )}
    </>
  );
};
