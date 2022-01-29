import * as Icons from "@ant-design/icons";
import { Avatar, Card, Space, Typography } from "antd";
import React, { FC } from "react";
import { useOrganization } from "../hooks";
import Link from "next/link";

interface Props {
  organizationId: string;
}

export const CreateProjectCard: FC<Props> = ({ organizationId }) => {
  const { organization } = useOrganization(organizationId);

  if (!organization) return null;
  return (
    <Link href={`${organization.permalink}/create`}>
      <a>
        <Card
          size="small"
          className="dewo-project-card hover:component-highlight"
        >
          <Space direction="vertical" align="center">
            <Avatar size="large">
              <Icons.PlusOutlined />
            </Avatar>
            <Typography.Title level={5}>Create Project</Typography.Title>
          </Space>
        </Card>
      </a>
    </Link>
  );
};
