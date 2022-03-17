import React, { FC } from "react";
import { Avatar, Button, Modal, Row, Typography } from "antd";
import { IncognitoIcon } from "@dewo/app/components/icons/Incognito";
import Link from "next/link";
import { LoginButton } from "@dewo/app/containers/auth/LoginButton";
import { useAuthContext } from "../contexts/AuthContext";
import { useOrganization } from "../containers/organization/hooks";

interface Props {
  visible: boolean;
  organizationId?: string;
}

export const ForbiddenResourceModal: FC<Props> = ({
  visible,
  organizationId,
}) => {
  const { user } = useAuthContext();
  const { organization } = useOrganization(organizationId);
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
        You don't have access to this project. Connect to continue or go back
        home.
      </Typography.Paragraph>
      <Row style={{ gap: 16, justifyContent: "center" }}>
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
        {!user && <LoginButton type="primary">Connect</LoginButton>}
      </Row>
    </Modal>
  );
};
