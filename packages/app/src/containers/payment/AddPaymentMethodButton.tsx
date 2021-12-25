import { CreatePaymentMethodInput } from "@dewo/app/graphql/types";
import { useToggle } from "@dewo/app/util/hooks";
import { Button, Modal } from "antd";
import React, { FC } from "react";
import { PaymentMethodForm } from "./PaymentMethodForm";

interface Props {
  inputOverride?: Partial<CreatePaymentMethodInput>;
  selectTokens?: boolean;
}

export const AddPaymentMethodButton: FC<Props> = ({
  inputOverride,
  selectTokens,
}) => {
  const addPaymentMethod = useToggle();
  return (
    <>
      <Button onClick={addPaymentMethod.toggleOn}>Add Payment Method</Button>
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
