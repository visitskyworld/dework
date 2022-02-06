import { useRunningCallback } from "@dewo/app/util/hooks";
import { Button, Input, Modal, Space, Typography } from "antd";
import React, { FC, useState } from "react";
import { useCreateProjectSection } from "../hooks";

interface Props {
  visible: boolean;
  organizationId: string;
  onClose(): void;
}

export const CreateSectionModal: FC<Props> = ({
  visible,
  organizationId,
  onClose,
}) => {
  const [name, setName] = useState("");

  const createSection = useCreateProjectSection();
  const [handleCreate, creating] = useRunningCallback(async () => {
    await createSection({ name, organizationId });
    setName("");
    onClose();
  }, [name, organizationId, createSection, onClose]);

  return (
    <Modal visible={visible} width={368} onCancel={onClose} footer={null}>
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
