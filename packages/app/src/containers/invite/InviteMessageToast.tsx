import React, { FC, useCallback, useEffect, useMemo, useRef } from "react";
import _ from "lodash";
import { useRouter } from "next/router";
import { Button, message, Space, Typography } from "antd";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { useAcceptInvite, useInvite } from "./hooks";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { useToggle } from "@dewo/app/util/hooks";
import { LoginModal } from "../auth/LoginModal";
import { RulePermission, UserDetails } from "@dewo/app/graphql/types";
import { hasDiscordThreepid } from "@dewo/app/src/containers/auth/hooks";
import { JoinTokenGatedProjectsModal } from "./JoinTokenGatedProjectsModal";
import { ConnectDiscordModal } from "../auth/ConnectDiscordModal";
import { InviteMessage } from "./InviteMessage";
import { usePrompt } from "../prompts/hooks";

const permissionToVerb: Record<RulePermission, string> = {
  [RulePermission.VIEW_PROJECTS]: "view",
  [RulePermission.MANAGE_TASKS]: "contribute to",
  [RulePermission.MANAGE_PROJECTS]: "manage",
  [RulePermission.MANAGE_ORGANIZATION]: "manage",
  [RulePermission.MANAGE_FUNDING]: "manage",
};

export const InviteMessageToast: FC = () => {
  const showingPrompt = !!usePrompt().step;

  const router = useRouter();
  const inviteId = router.query.inviteId as string | undefined;
  const invite = useInvite(inviteId);

  const tokens = useMemo(
    () => invite?.project?.tokenGates.map((t) => t.token) ?? [],
    [invite?.project?.tokenGates]
  );
  const isTokenGated = !!tokens.length;

  const { user } = useAuthContext();
  const authenticated = !!user;
  const authModalVisible = useToggle();
  const tokenGatedModalVisible = useToggle();
  const connectDiscordModalVisible = useToggle();

  const acceptInvite = useAcceptInvite();

  const routerRef = useRef(router);
  routerRef.current = router;
  const handleAcceptInvite = useCallback(async () => {
    await acceptInvite(inviteId!);
    message.destroy();
    message.success({
      content: "Invite accepted!",
      type: "success",
    });
    routerRef.current.push({
      pathname: routerRef.current.pathname,
      query: _.omit(routerRef.current.query, ["inviteId", "autoJoin"]),
    });
    tokenGatedModalVisible.toggleOff();
  }, [acceptInvite, tokenGatedModalVisible, inviteId]);

  useEffect(() => {
    if (router.query.autoJoin && inviteId) {
      handleAcceptInvite();
    }
  }, [handleAcceptInvite, inviteId, router.query]);

  const inviteMessage = useMemo(() => {
    if (!invite) return undefined;

    const inviter = invite.inviter.username;
    if (!!invite.organization) {
      return (
        <InviteMessage
          inviter={inviter}
          permission={permissionToVerb[invite.permission]}
          to={invite.organization.name}
        />
      );
    }

    if (!!invite.project && !!invite.permission) {
      return (
        <InviteMessage
          inviter={inviter}
          permission={permissionToVerb[invite.permission]}
          to={invite.project.name}
        />
      );
    }

    if (!!invite.task) {
      return (
        <InviteMessage
          inviter={inviter}
          permission="claim"
          to={invite.task.name}
        />
      );
    }

    return `${inviter} has invited you to Dework`;
  }, [invite]);

  const showAuthModal = authModalVisible.toggleOn;
  const showTokenGateModal = tokenGatedModalVisible.toggleOn;
  const showConnectDiscordModal = connectDiscordModalVisible.toggleOn;

  const handleAuthedWithWalletSuccess = useCallback(
    async (userDetails: UserDetails) => {
      authModalVisible.toggleOff();
      handleAcceptInvite();

      if (!hasDiscordThreepid(userDetails)) {
        showConnectDiscordModal();
      } else if (isTokenGated) {
        showTokenGateModal();
      }
    },
    [
      isTokenGated,
      authModalVisible,
      showTokenGateModal,
      showConnectDiscordModal,
      handleAcceptInvite,
    ]
  );

  const handleCloseDiscordModal = () => {
    connectDiscordModalVisible.toggleOff();

    if (isTokenGated) {
      showTokenGateModal();
    } else {
      handleAcceptInvite();
    }
  };

  useEffect(() => {
    if (!invite || showingPrompt) return;

    const handleClick = async () => {
      message.destroy();

      if (!authenticated) {
        showAuthModal();
      } else if (!hasDiscordThreepid(user)) {
        showConnectDiscordModal();
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
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!invite, showingPrompt, authenticated]);

  const redirectUrl = useMemo(() => {
    const searchParams = new URLSearchParams({
      ...router.query,
      autoJoin: "true",
    }).toString();
    const basePath = router.asPath.split("?")[0];
    return `${basePath}?${searchParams}`;
  }, [router.asPath, router.query]);

  return (
    <>
      <LoginModal
        toggle={authModalVisible}
        onAuthedWithWallet={handleAuthedWithWalletSuccess}
        redirectUrl={redirectUrl}
      />
      {isTokenGated && (
        <JoinTokenGatedProjectsModal
          tokens={tokens}
          visible={tokenGatedModalVisible.isOn}
          onVerify={handleAcceptInvite}
          onClose={tokenGatedModalVisible.toggleOff}
        />
      )}
      <ConnectDiscordModal
        visible={connectDiscordModalVisible.isOn}
        onClose={handleCloseDiscordModal}
      />
    </>
  );
};
