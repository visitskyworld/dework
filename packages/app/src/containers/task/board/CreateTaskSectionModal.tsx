import { TaskStatus } from "@dewo/app/graphql/types";
import { useRunning } from "@dewo/app/util/hooks";
import { Button, Input, Modal, Space, Typography } from "antd";
import React, { FC, useCallback, useState } from "react";
import { useCreateTaskSection } from "../../project/hooks";

interface Props {
  visible: boolean;
  projectId: string;
  status: TaskStatus;
  onClose(): void;
}

export const CreateTaskSectionModal: FC<Props> = ({
  visible,
  projectId,
  status,
  onClose,
}) => {
  const [name, setName] = useState("");
  const createSection = useCreateTaskSection();
  const [handleCreate, creating] = useRunning(
    useCallback(async () => {
      await createSection({ name, status, projectId });
      onClose();
      setName("");
    }, [projectId, name, status, onClose, createSection])
  );

  return (
    <Modal
      visible={visible}
      width={368}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
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
