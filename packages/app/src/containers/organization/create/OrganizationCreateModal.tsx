import { Organization } from "@dewo/app/graphql/types";
import { Modal } from "antd";
import React, { FC } from "react";
import { OrganizationCreateForm } from "./OrganizationCreateForm";

interface OrganizationCreateModalProps {
  visible: boolean;
  onCancel(): void;
  onCreated(organization: Organization): unknown;
}

export const OrganizationCreateModal: FC<OrganizationCreateModalProps> = ({
  visible,
  onCancel,
  onCreated,
}) => {
  return (
    <Modal
      title="Create Organization"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <OrganizationCreateForm onCreated={onCreated} />
    </Modal>
  );
};
