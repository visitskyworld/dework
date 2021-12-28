import { CreatePaymentMethodInput } from "@dewo/app/graphql/types";
import { useToggle, UseToggleHook } from "@dewo/app/util/hooks";
import { Button, ButtonProps, Modal } from "antd";
import React, { FC } from "react";
import { PaymentMethodForm } from "./PaymentMethodForm";

interface Props {
  inputOverride?: Partial<CreatePaymentMethodInput>;
  selectTokens?: boolean;
}

type AddPaymentMethodButtonProps = Props & ButtonProps;
type AddPaymentMethodModalProps = Props & { toggle: UseToggleHook };

export const AddPaymentMethodButton: FC<AddPaymentMethodButtonProps> = ({
  inputOverride,
  selectTokens,
  ...buttonProps
}) => {
  const addPaymentMethod = useToggle();
  return (
    <>
      <Button {...buttonProps} onClick={addPaymentMethod.toggleOn} />
      <AddPaymentMethodModal
        toggle={addPaymentMethod}
        selectTokens={selectTokens}
        inputOverride={inputOverride}
      />
    </>
  );
};

export const AddPaymentMethodModal: FC<AddPaymentMethodModalProps> = ({
  inputOverride,
  selectTokens,
  toggle,
}) => (
  <Modal
    visible={toggle.isOn}
    title="Add Payment Method"
    footer={null}
    onCancel={toggle.toggleOff}
  >
    <PaymentMethodForm
      selectTokens={selectTokens}
      inputOverride={inputOverride}
      onDone={toggle.toggleOff}
    />
  </Modal>
);
