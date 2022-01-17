import { Modal } from "antd";
import React, { FC } from "react";
import { ProjectPaymentMethodForm } from "./ProjectPaymentMethodForm";

interface Props {
  visible: boolean;
  projectId: string;
  onClose(): void;
}

export const AddProjectPaymentMethodModal: FC<Props> = ({
  projectId,
  visible,
  onClose,
}) => (
  <Modal
    visible={visible}
    title="Add Payment Method"
    footer={null}
    onCancel={onClose}
  >
    <ProjectPaymentMethodForm projectId={projectId} onDone={onClose} />
  </Modal>
);
