import React, { FC } from "react";
import { Alert, Button, Space, Typography } from "antd";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { CreateProjectButton } from "../CreateProjectButton";
import Link from "next/link";
import { useOrganization } from "../../hooks";

interface Props {
  organizationId: string;
}

export const ProjectListEmpty: FC<Props> = ({ organizationId }) => {
  const { organization } = useOrganization(organizationId);
  const canCreateProject = usePermission("create", "Project");
  if (canCreateProject) {
    return (
      <Alert
        message="This is your DAO workspace. Create your first Dework project or import a project from Notion or Trello!"
        type="info"
        description={
          <Space>
            <Link href={`${organization?.permalink}/create`}>
              <a>
                <Button type="primary">Create Project</Button>
              </a>
            </Link>
            <CreateProjectButton organizationId={organizationId} mode="import">
              Import from Notion/Trello
            </CreateProjectButton>
          </Space>
        }
      />
    );
  }
  return (
    <Typography.Text type="secondary">
      This DAO hasn't set up any public projects yet!
    </Typography.Text>
  );
};
