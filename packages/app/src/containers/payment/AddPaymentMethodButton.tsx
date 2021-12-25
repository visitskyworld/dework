import { CreatePaymentMethodInput } from "@dewo/app/graphql/types";
import { useToggle } from "@dewo/app/util/hooks";
import { Button, Modal } from "antd";
import React, { FC, useCallback } from "react";
import { PaymentMethodForm } from "./PaymentMethodForm";

interface Props {
  inputOverride?: Partial<CreatePaymentMethodInput>;
  onDone(): Promise<void>;
}

export const AddPaymentMethodButton: FC<Props> = ({
  onDone,
  inputOverride,
}) => {
  const addPaymentMethod = useToggle();
  const handleDone = useCallback(async () => {
    await onDone();
    addPaymentMethod.toggleOff();
  }, [addPaymentMethod, onDone]);
  return (
    <>
      <Button onClick={addPaymentMethod.toggleOn}>Add Payment Method</Button>
      <Modal
        visible={addPaymentMethod.isOn}
        title="Add Payment Method"
        footer={null}
        onCancel={addPaymentMethod.toggleOff}
      >
        <PaymentMethodForm inputOverride={inputOverride} onDone={handleDone} />
      </Modal>
    </>
  );
};
