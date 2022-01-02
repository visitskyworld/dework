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

const messageBottomStyle: CSSProperties = {
  marginTop: "calc(100vh - 100px)",
};

export const InviteMessageToast: FC = () => {
  const router = useRouter();
  const inviteId = router.query.inviteId as string | undefined;
  const invite = useInvite(inviteId);

  const authenticated = !!useAuthContext().user;
  const authModalVisible = useToggle();

  const acceptInvite = useAcceptInvite();
  const handleAcceptInvite = useCallback(async () => {
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
  }, [acceptInvite, inviteId, router]);

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

  useEffect(() => {
    if (!invite) return;

    message.destroy();
    message.open({
      content: (
        <RouterContext.Provider value={router}>
          <Space>
            <UserAvatar user={invite.inviter} />
            <Typography.Text style={{ marginRight: 16 }}>
              {inviteMessage}
            </Typography.Text>
            <Button
              type="primary"
              onClick={
                authenticated ? handleAcceptInvite : authModalVisible.toggleOn
              }
            >
              Accept invite
            </Button>
          </Space>
        </RouterContext.Provider>
      ),
      duration: 0, // forever
      type: undefined as any,
      style: messageBottomStyle,
      onClick: () => message.destroy(),
    });
  }, [
    invite,
    inviteId,
    inviteMessage,
    router,
    authenticated,
    authModalVisible.toggleOn,
    handleAcceptInvite,
  ]);

  return <LoginModal toggle={authModalVisible} />;
};
