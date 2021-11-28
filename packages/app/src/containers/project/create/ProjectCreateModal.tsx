import { Project } from "@dewo/app/graphql/types";
import { Modal } from "antd";
import React, { FC } from "react";
import { ProjectCreateForm } from "./ProjectCreateForm";

interface ProjectCreateModalProps {
  visible: boolean;
  organizationId: string;
  onCancel(): void;
  onCreated(project: Project): unknown;
}

export const ProjectCreateModal: FC<ProjectCreateModalProps> = ({
  visible,
  organizationId,
  onCancel,
  onCreated,
}) => {
  return (
    <Modal
      title="Create Project"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <ProjectCreateForm
        organizationId={organizationId}
        onCreated={onCreated}
      />
    </Modal>
  );
};
