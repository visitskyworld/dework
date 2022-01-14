import { UseToggleHook } from "@dewo/app/util/hooks";
import { Modal } from "antd";
import React, { FC } from "react";
import { ProjectPaymentMethodForm } from "./ProjectPaymentMethodForm";

interface Props {
  projectId: string;
  toggle: UseToggleHook;
}

export const AddProjectPaymentMethodModal: FC<Props> = ({
  projectId,
  toggle,
}) => (
  <Modal
    visible={toggle.isOn}
    title="Add Payment Method"
    footer={null}
    onCancel={toggle.toggleOff}
  >
    <ProjectPaymentMethodForm projectId={projectId} onDone={toggle.toggleOff} />
  </Modal>
);
