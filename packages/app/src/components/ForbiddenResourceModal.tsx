import React, { FC, useMemo } from "react";
import { Avatar, Button, Modal, Row, Typography } from "antd";
import { IncognitoIcon } from "@dewo/app/components/icons/Incognito";
import Link from "next/link";
import { useAuthContext } from "../contexts/AuthContext";
import { useOrganizationRoles } from "../containers/rbac/hooks";
import { useOrganization } from "../containers/organization/hooks";
import { RoleSource, RulePermission, ThreepidSource } from "../graphql/types";
import { RoleTag } from "./RoleTag";
import { ThreepidAuthButton } from "../containers/auth/ThreepidAuthButton";
import { LoginButton } from "../containers/auth/LoginButton";

interface Props {
  visible: boolean;
  projectId?: string;
  organizationId?: string;
}

export const ForbiddenResourceModal: FC<Props> = ({
  visible,
  projectId,
  organizationId,
}) => {
  const { user } = useAuthContext();
  const organization = useOrganization(organizationId);
  const roles = useOrganizationRoles(organizationId);
  const rolesWithAccess = useMemo(
    () =>
      roles?.filter((r) =>
        r.rules.some(
          (rule) =>
            rule.permission === RulePermission.VIEW_PROJECTS &&
            rule.projectId === projectId &&
            !rule.inverted
        )
      ),
    [roles, projectId]
  );
  const isConnectedToDiscord = useMemo(
    () => user?.threepids.some((t) => t.source === ThreepidSource.discord),
    [user]
  );
  const isDiscordRoleAllowedAccess = useMemo(
    () => !!rolesWithAccess?.some((r) => r.source === RoleSource.DISCORD),
    [rolesWithAccess]
  );
  return (
    <Modal
      visible={visible}
      footer={null}
      style={{ textAlign: "center" }}
      closable={false}
    >
      <Avatar
        icon={<IncognitoIcon style={{ width: 72, height: 72 }} />}
        size={96}
        style={{ display: "grid", placeItems: "center" }}
        className="mx-auto"
      />
      <Typography.Title level={4} style={{ marginTop: 16 }}>
        Access denied
      </Typography.Title>
      <Typography.Paragraph type="secondary">
        You don't have access to this project.
        {!!rolesWithAccess?.length &&
          " The following roles can access this project:"}
      </Typography.Paragraph>
      {!!rolesWithAccess?.length && (
        <Row style={{ justifyContent: "center", marginBottom: 16, rowGap: 4 }}>
          {rolesWithAccess
            ?.filter((role) => !role.userId)
            .map((role) => (
              <RoleTag key={role.id} role={role} />
            ))}
        </Row>
      )}
      <Row style={{ gap: 8, justifyContent: "center" }}>
        {!!organization ? (
          <Link href={organization.permalink}>
            <a>
              <Button>Go to DAO page</Button>
            </a>
          </Link>
        ) : (
          <Link href="/">
            <a>
              <Button>Go Home</Button>
            </a>
          </Link>
        )}
        {!user ? (
          <LoginButton type="primary">Connect</LoginButton>
        ) : (
          !isConnectedToDiscord &&
          isDiscordRoleAllowedAccess && (
            <ThreepidAuthButton
              type="primary"
              source={ThreepidSource.discord}
              children="Connect with Discord"
            />
          )
        )}
      </Row>
    </Modal>
  );
};
