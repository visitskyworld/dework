import { useToggle } from "@dewo/app/util/hooks";
import { Button, ButtonProps, Modal } from "antd";
import React, { FC } from "react";
import { CreateFundingSessionForm } from "./CreateFundingSessionForm";

interface Props extends ButtonProps {
  organizationId: string;
}

export const CreateFundingSessionButton: FC<Props> = ({
  organizationId,
  ...buttonProps
}) => {
  const modal = useToggle();
  return (
    <>
      <Button {...buttonProps} onClick={modal.toggleOn} />
      <Modal
        visible={modal.isOn}
        width={368}
        destroyOnClose
        footer={null}
        onCancel={modal.toggleOff}
      >
        <CreateFundingSessionForm
          organizationId={organizationId}
          onDone={modal.toggleOff}
        />
      </Modal>
    </>
  );
};
