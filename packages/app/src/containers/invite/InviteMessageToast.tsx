import React, { FC, useCallback, useEffect } from "react";
import _ from "lodash";
import { useRouter } from "next/router";
import { Button, message, Space, Typography } from "antd";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { useAcceptInvite, useInvite } from "./hooks";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";

export const InviteMessageToast: FC = () => {
  const router = useRouter();
  const inviteId = router.query.inviteId as string | undefined;
  const invite = useInvite(inviteId);

  const authenticated = !!useAuthContext().user;

  const acceptInvite = useAcceptInvite();
  const handleAcceptInvite = useCallback(async () => {
    if (authenticated) {
      await acceptInvite(inviteId!);
      message.destroy();
      message.success({
        content: "Invite accepted!",
        type: "success",
        style: { marginTop: "calc(100vh - 100px)" },
      });
    } else {
      router.push(`/auth?inviteId=${inviteId}&redirect=${router.asPath}`);
    }
  }, [acceptInvite, authenticated, inviteId, router]);

  useEffect(() => {
    if (!invite) return;

    message.destroy();
    message.open({
      content: (
        <RouterContext.Provider value={router}>
          <Space>
            <UserAvatar user={invite.inviter} />
            <Typography.Text style={{ marginRight: 16 }}>
              {invite.inviter.username} has invited you to{" "}
              {invite.organization?.name ?? "Dework"}
            </Typography.Text>
            <Button type="primary" onClick={handleAcceptInvite}>
              Accept invite
            </Button>
          </Space>
        </RouterContext.Provider>
      ),
      duration: 0, // forever
      type: undefined as any,
      style: { marginTop: "calc(100vh - 100px)" },
      onClick: () => message.destroy(),
    });
    // }, [!!invite]);
  }, [invite, inviteId, router, handleAcceptInvite]);

  return null;
};

// http://localhost:3000/organization/090946a9-d575-4785-b7bf-08f616bd8bc3/project/f8348382-e249-4878-8d81-3d4e69b9843d?inviteId=dc741047-beb9-46f4-ae1f-fc86f9102996
