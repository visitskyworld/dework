import { CreatePaymentMethodInput } from "@dewo/app/graphql/types";
import { useToggle } from "@dewo/app/util/hooks";
import { Button, ButtonProps, Modal } from "antd";
import React, { FC } from "react";
import { PaymentMethodForm } from "./PaymentMethodForm";

interface Props extends ButtonProps {
  inputOverride?: Partial<CreatePaymentMethodInput>;
  selectTokens?: boolean;
}

export const AddPaymentMethodButton: FC<Props> = ({
  inputOverride,
  selectTokens,
  ...buttonProps
}) => {
  const addPaymentMethod = useToggle();
  return (
    <>
      <Button {...buttonProps} onClick={addPaymentMethod.toggleOn} />
      <Modal
        visible={addPaymentMethod.isOn}
        title="Add Payment Method"
        footer={null}
        onCancel={addPaymentMethod.toggleOff}
      >
        <PaymentMethodForm
          selectTokens={selectTokens}
          inputOverride={inputOverride}
          onDone={addPaymentMethod.toggleOff}
        />
      </Modal>
    </>
  );
};
