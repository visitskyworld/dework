import React, { FC } from "react";
import { Avatar, Button, Modal, Row, Typography } from "antd";
import { IncognitoIcon } from "@dewo/app/components/icons/Incognito";
import Link from "next/link";
import { useRolesWithAccess } from "../containers/rbac/hooks";
import { useOrganization } from "../containers/organization/hooks";
import { RoleTag } from "./RoleTag";
import { ConnectUsingDiscordRolesButton } from "../containers/auth/ConnectUsingDiscordRolesButton";

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
  const organization = useOrganization(organizationId);
  const roles = useRolesWithAccess(organizationId, projectId);
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
        {!!roles?.length && " The following roles can access this project:"}
      </Typography.Paragraph>
      {!!roles?.length && (
        <Row style={{ justifyContent: "center", marginBottom: 16, rowGap: 4 }}>
          {roles
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
        {!!organizationId && (
          <ConnectUsingDiscordRolesButton
            type="primary"
            projectId={projectId}
            organizationId={organizationId}
            children="Connect with Discord"
          />
        )}
      </Row>
    </Modal>
  );
};
