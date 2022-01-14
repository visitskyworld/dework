import { UseToggleHook } from "@dewo/app/util/hooks";
import { Modal } from "antd";
import React, { FC } from "react";
import { UserPaymentMethodForm } from "./UserPaymentMethodForm";

interface Props {
  userId: string;
  toggle: UseToggleHook;
}

export const AddUserPaymentMethodModal: FC<Props> = ({ userId, toggle }) => (
  <Modal
    visible={toggle.isOn}
    title="Connect Wallet"
    footer={null}
    onCancel={toggle.toggleOff}
  >
    <UserPaymentMethodForm userId={userId} onDone={toggle.toggleOff} />
  </Modal>
);
