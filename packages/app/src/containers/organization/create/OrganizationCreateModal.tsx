import { Modal } from "antd";
import React, { FC } from "react";
import { OrganizationCreateForm } from "./OrganizationCreateForm";

interface OrganizationCreateModalProps {
  visible: boolean;
  onClose(): void;
}

export const OrganizationCreateModal: FC<OrganizationCreateModalProps> = ({
  visible,
  onClose,
}) => {
  return (
    <Modal
      title="Create Organization"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <OrganizationCreateForm onCreated={onClose} />
    </Modal>
  );
};
