import React, {
  CSSProperties,
  FC,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import _ from "lodash";
import { useRouter } from "next/router";
import { Button, message, Space, Typography } from "antd";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { useAcceptInvite, useInvite } from "./hooks";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { useToggle } from "@dewo/app/util/hooks";
import { LoginModal } from "../auth/LoginModal";
import { OrganizationRole, ProjectRole } from "@dewo/app/graphql/types";
import { JoinTokenGatedProjectsModal } from "./JoinTokenGatedProjectsModal";
import { ApolloError } from "@apollo/client";

const messageBottomStyle: CSSProperties = {
  marginTop: "calc(100vh - 140px)",
};

export const InviteMessageToast: FC = () => {
  const router = useRouter();
  const inviteId = router.query.inviteId as string | undefined;
  const invite = useInvite(inviteId);

  const tokens = useMemo(
    () => invite?.project?.tokenGates.map((t) => t.token) ?? [],
    [invite?.project?.tokenGates]
  );
  const isTokenGated = !!tokens.length;

  const authenticated = !!useAuthContext().user;
  const authModalVisible = useToggle();
  const tokenGatedModalVisible = useToggle();

  const acceptInvite = useAcceptInvite();
  const handleAcceptInvite = useCallback(async () => {
    try {
      await acceptInvite(inviteId!);
      message.destroy();
      message.success({
        content: "Invite accepted!",
        type: "success",
        style: messageBottomStyle,
      });
      router.push({
        pathname: router.pathname,
        query: _.omit(router.query, ["inviteId"]),
      });
      tokenGatedModalVisible.toggleOff();
    } catch (error) {
      if (error instanceof ApolloError) {
        const reason =
          error.graphQLErrors[0]?.extensions?.exception?.response?.reason;
        if (reason === "MISSING_TOKENS") {
          message.error(
            `You don't have ${tokens
              .map((t) => t.symbol)
              .join(", ")} in any connected wallet`
          );
        }
      }
    }
  }, [acceptInvite, tokenGatedModalVisible, inviteId, tokens, router]);

  const inviteMessage = useMemo(() => {
    if (!invite) return undefined;

    const inviter = invite.inviter.username;
    if (!!invite.organization) {
      if (invite.organizationRole === OrganizationRole.ADMIN) {
        return `${inviter} has invited you as an admin to ${invite.organization.name}`;
      }

      return `${inviter} has invited you to ${invite.organization.name}`;
    }

    if (!!invite.project) {
      if (invite.projectRole === ProjectRole.ADMIN) {
        return `${inviter} has invited you as an admin to ${invite.project.name}`;
      }

      return `${inviter} has invited you to ${invite.project.name}`;
    }

    return `${inviter} has invited you to Dework`;
  }, [invite]);

  const showAuthModal = authModalVisible.toggleOn;
  const showTokenGateModal = tokenGatedModalVisible.toggleOn;
  useEffect(() => {
    if (!invite) return;

    const handleClick = () => {
      message.destroy();
      if (!authenticated) {
        showAuthModal();
      } else if (isTokenGated) {
        showTokenGateModal();
      } else {
        handleAcceptInvite();
      }
    };

    message.destroy();
    message.open({
      content: (
        <RouterContext.Provider value={router}>
          <Space>
            <UserAvatar user={invite.inviter} />
            <Typography.Text style={{ marginRight: 16 }}>
              {inviteMessage}
            </Typography.Text>
            <Button type="primary" onClick={handleClick}>
              Accept invite
            </Button>
          </Space>
        </RouterContext.Provider>
      ),
      duration: 0, // forever
      type: undefined as any,
      style: messageBottomStyle,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!invite]);

  return (
    <>
      <LoginModal
        toggle={authModalVisible}
        onDone={() => {
          authModalVisible.toggleOff();
          isTokenGated ? showTokenGateModal() : handleAcceptInvite();
        }}
      />
      {isTokenGated && (
        <JoinTokenGatedProjectsModal
          tokens={tokens}
          visible={tokenGatedModalVisible.isOn}
          onVerify={handleAcceptInvite}
          onClose={tokenGatedModalVisible.toggleOff}
        />
      )}
    </>
  );
};
