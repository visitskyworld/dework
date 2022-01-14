import { useToggle } from "@dewo/app/util/hooks";
import { Button, ButtonProps } from "antd";
import React, { FC } from "react";
import { AddUserPaymentMethodModal } from "./AddUserPaymentMethodModal";

interface Props extends ButtonProps {
  userId: string;
}

export const AddUserPaymentMethodButton: FC<Props> = ({
  userId,
  ...buttonProps
}) => {
  const addPaymentMethod = useToggle();
  return (
    <>
      <Button {...buttonProps} onClick={addPaymentMethod.toggleOn} />
      <AddUserPaymentMethodModal toggle={addPaymentMethod} userId={userId} />
    </>
  );
};
