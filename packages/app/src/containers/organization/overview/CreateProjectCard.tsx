import { Project } from "@dewo/app/graphql/types";
import { useToggle } from "@dewo/app/util/hooks";
import * as Icons from "@ant-design/icons";
import { Avatar, Card, Space, Typography } from "antd";
import { useRouter } from "next/router";
import React, { FC, useCallback } from "react";
import { ProjectCreateModal } from "../../project/create/ProjectCreateModal";

interface Props {
  organizationId: string;
}

export const CreateProjectCard: FC<Props> = ({ organizationId }) => {
  const showModal = useToggle();
  const router = useRouter();
  const handleProjectCreated = useCallback(
    async (project: Project) => {
      await router.push(
        "/organization/[organizationId]/project/[projectId]",
        `/organization/${organizationId}/project/${project.id}`
      );
      showModal.toggleOff();
    },
    [router, showModal, organizationId]
  );
  return (
    <>
      <Card
        onClick={showModal.toggleOn}
        className="dewo-card-create-project hover:component-highlight"
      >
        <Space direction="vertical" align="center">
          <Avatar size="large">
            <Icons.PlusOutlined />
          </Avatar>
          <Typography.Title level={5}>Create Project</Typography.Title>
        </Space>
      </Card>
      <ProjectCreateModal
        visible={showModal.value}
        organizationId={organizationId}
        onCancel={showModal.toggleOff}
        onCreated={handleProjectCreated}
      />
    </>
  );
};
