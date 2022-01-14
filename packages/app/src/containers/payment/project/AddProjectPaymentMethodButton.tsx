import { useToggle } from "@dewo/app/util/hooks";
import { Button, ButtonProps } from "antd";
import React, { FC } from "react";
import { AddProjectPaymentMethodModal } from "./AddProjectPaymentMethodModal";

interface Props extends ButtonProps {
  projectId: string;
}

export const AddProjectPaymentMethodButton: FC<Props> = ({
  projectId,
  ...buttonProps
}) => {
  const addPaymentMethod = useToggle();
  return (
    <>
      <Button {...buttonProps} onClick={addPaymentMethod.toggleOn} />
      <AddProjectPaymentMethodModal
        toggle={addPaymentMethod}
        projectId={projectId}
      />
    </>
  );
};
