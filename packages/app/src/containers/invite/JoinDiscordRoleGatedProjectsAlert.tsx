import { Alert, Button, message } from "antd";
import React, { CSSProperties, FC, useCallback, useMemo } from "react";
import { useOrganization } from "../organization/hooks";
import { useToggle } from "@dewo/app/util/hooks";
import { LoginButton } from "../auth/LoginButton";
import { ProjectTokenGate } from "@dewo/app/graphql/types";
import { useJoinProjectWithToken } from "./hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import _ from "lodash";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { DiscordIcon } from "@dewo/app/components/icons/Discord";

interface Props {
  organizationId: string;
  style?: CSSProperties;
}

export const JoinDiscordRoleGatedProjectsAlert: FC<Props> = ({
  organizationId,
  style,
}) => {
  const modalVisible = useToggle();
  const editingProfile = useToggle();
  const { user } = useAuthContext();
  const { organization, refetch } = useOrganization(organizationId);

  const tokenGates = useMemo(
    () =>
      organization?.projectTokenGates?.filter((g) => {
        const project = organization.projects.find((p) => p.id === g.projectId);
        if (!project) return true;
        return !project.members.some((m) => m.userId === user?.id);
      }),
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
  // if (!tokenGates?.length || canAccessAllProjects !== false) return null;

  const tokensString = tokens.map((t) => t.symbol).join(", ");

  return (
    <>
      <Alert
        message="There are projects that you can access by your Discord role in this DAO's server"
        type="info"
        style={style}
        description={
          !!user ? (
            <Button
              type="primary"
              icon={<DiscordIcon />}
              onClick={modalVisible.toggleOn}
            >
              Join
            </Button>
          ) : (
            <LoginButton
              type="primary"
              icon={<DiscordIcon />}
              onAuthedWithWallet={editingProfile.toggleOn}
            >
              Join
            </LoginButton>
          )
        }
        showIcon
      />
      {/* {!!user && (
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
      )} */}
    </>
  );
};
