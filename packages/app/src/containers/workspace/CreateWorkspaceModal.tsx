import { useRunning } from "@dewo/app/util/hooks";
import { Button, Input, Modal, Space, Typography } from "antd";
import React, { FC, useCallback, useState } from "react";
import { useCreateWorkspace } from "./hooks";

interface Props {
  visible: boolean;
  organizationId: string;
  onClose(): void;
}

export const CreateWorkspaceModal: FC<Props> = ({
  visible,
  organizationId,
  onClose,
}) => {
  const [name, setName] = useState("");
  const createWorkspace = useCreateWorkspace();
  const [handleCreate, creating] = useRunning(
    useCallback(async () => {
      await createWorkspace({ name, organizationId });
      onClose();
      setName("");
    }, [organizationId, onClose, name, createWorkspace])
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
          Create Workspace
        </Typography.Title>
        <Input
          autoFocus
          placeholder="Enter workspace name..."
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
