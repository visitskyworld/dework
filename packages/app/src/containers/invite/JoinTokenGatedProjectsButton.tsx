import { Alert, Button, message } from "antd";
import React, { FC, useCallback, useMemo } from "react";
import { useOrganization } from "../organization/hooks";
import * as Icons from "@ant-design/icons";
import { useCurrentUser, useToggle } from "@dewo/app/util/hooks";
import { LoginButton } from "../auth/LoginButton";
import { JoinTokenGatedProjectsModal } from "./JoinTokenGatedProjectsModal";
import { ProjectTokenGate } from "@dewo/app/graphql/types";
import { useJoinProjectWithToken } from "./hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import _ from "lodash";
import { UserProfileFormModal } from "../user/UserProfileFormModal";

interface Props {
  organizationId: string;
}

export const JoinTokenGatedProjectsButton: FC<Props> = ({ organizationId }) => {
  const modalVisible = useToggle();
  const editingProfile = useToggle();
  const user = useCurrentUser();

  const { organization, refetch } = useOrganization(organizationId);

  const tokenGates = useMemo(
    () =>
      organization?.projectTokenGates?.filter(
        (g) =>
          !organization?.projects.some(
            (p) =>
              p.id === g.projectId &&
              !p.members.some((m) => m.userId === user?.id)
          )
      ),
    [organization?.projectTokenGates, organization?.projects, user?.id]
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

  const canAccessAllProjects = usePermission("update", "Project");
  if (!tokenGates?.length || canAccessAllProjects !== false) return null;

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
              onAuthedWithMetamask={editingProfile.toggleOn}
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
          userId={user.id}
          visible={editingProfile.isOn}
          showDetails={false}
          defaultEditing={true}
          onCancel={handleProfileSaved}
          onSaved={handleProfileSaved}
        />
      )}
    </>
  );
};
