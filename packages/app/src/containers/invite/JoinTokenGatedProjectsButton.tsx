import { Button, message } from "antd";
import React, { FC, useCallback, useMemo } from "react";
import { useOrganization } from "../organization/hooks";
import * as Icons from "@ant-design/icons";
import { useCurrentUser, useToggle } from "@dewo/app/util/hooks";
import { LoginButton } from "../auth/LoginButton";
import { JoinTokenGatedProjectsModal } from "./JoinTokenGatedProjectsModal";
import { ProjectTokenGate } from "@dewo/app/graphql/types";
import { useJoinProjectWithToken } from "./hooks";
import { ApolloError } from "@apollo/client";

interface Props {
  organizationId: string;
}

export const JoinTokenGatedProjectsButton: FC<Props> = ({ organizationId }) => {
  const modalVisible = useToggle();
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
    () => tokenGates?.map((t) => t.token) ?? [],
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
      } catch (error) {
        if (error instanceof ApolloError) {
          const reason =
            error.graphQLErrors[0]?.extensions?.exception?.response?.reason;
          if (reason === "MISSING_TOKENS") {
            message.error(
              `You don't have ${token.symbol} in any connected wallet`
            );
          }
        }
      }

      await refetch();
      modalVisible.toggleOff();
    },
    [tokenGates, refetch, joinProjectWithToken, modalVisible]
  );

  if (!tokenGates?.length) return null;
  const buttonText = `Join private projects using ${tokens
    .map((t) => t.symbol)
    .join(", ")}`;
  return (
    <>
      {!!user ? (
        <Button
          type="primary"
          size="small"
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
          tokens={tokens}
          visible={modalVisible.isOn}
          onClose={modalVisible.toggleOff}
          onVerify={verifyProjectsWithToken}
        />
      )}
    </>
  );
};
