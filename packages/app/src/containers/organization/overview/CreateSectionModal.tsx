import { TaskStatus } from "@dewo/app/graphql/types";
import { useRunningCallback } from "@dewo/app/util/hooks";
import { Button, Input, Modal, Space, Typography } from "antd";
import React, { FC, useCallback, useState } from "react";
import { useCreateTaskSection } from "../../project/hooks";
import { useCreateProjectSection } from "../hooks";

interface Props {
  visible: boolean;
  onCancel(): void;
  onCreate(name: string): Promise<void>;
}

const CreateSectionModal: FC<Props> = ({ visible, onCreate, onCancel }) => {
  const [name, setName] = useState("");

  const [handleCreate, creating] = useRunningCallback(async () => {
    await onCreate(name);
    setName("");
  }, [name, onCreate]);

  return (
    <Modal visible={visible} width={368} onCancel={onCancel} footer={null}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Typography.Title level={5} style={{ textAlign: "center", margin: 0 }}>
          Create Section
        </Typography.Title>
        <Input
          autoFocus
          placeholder="Enter section name..."
          disabled={creating}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onPressEnter={handleCreate}
        />
        <Button
          block
          loading={creating}
          type="primary"
          disabled={!name}
          onClick={handleCreate}
        >
          Create
        </Button>
      </Space>
    </Modal>
  );
};

interface ProjectProps {
  visible: boolean;
  organizationId: string;
  onClose(): void;
}

export const CreateProjectSectionModal: FC<ProjectProps> = ({
  visible,
  organizationId,
  onClose,
}) => {
  const createSection = useCreateProjectSection();
  const handleCreate = useCallback(
    async (name: string) => {
      await createSection({ name, organizationId });
      onClose();
    },
    [organizationId, onClose, createSection]
  );
  return (
    <CreateSectionModal
      visible={visible}
      onCancel={onClose}
      onCreate={handleCreate}
    />
  );
};

interface TaskProps {
  visible: boolean;
  projectId: string;
  status: TaskStatus;
  onClose(): void;
}

export const CreateTaskSectionModal: FC<TaskProps> = ({
  visible,
  projectId,
  status,
  onClose,
}) => {
  const createSection = useCreateTaskSection();
  const handleCreate = useCallback(
    async (name: string) => {
      await createSection({ name, status, projectId });
      onClose();
    },
    [projectId, status, onClose, createSection]
  );
  return (
    <CreateSectionModal
      visible={visible}
      onCancel={onClose}
      onCreate={handleCreate}
    />
  );
};
