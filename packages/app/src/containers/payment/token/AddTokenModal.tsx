import { PaymentToken } from "@dewo/app/graphql/types";
import { Modal } from "antd";
import React, { FC, useCallback } from "react";
import { useAddTokenToOrganization } from "../../organization/hooks";
import { PaymentMethodEducationAlert } from "./PaymentMethodEducationAlert";
import { PaymentTokenForm } from "./PaymentTokenForm";

interface Props {
  visible: boolean;
  organizationId: string;
  onClose(token?: PaymentToken): void;
}

export const AddTokenModal: FC<Props> = ({
  organizationId,
  visible,
  onClose,
}) => {
  const addTokenToOrganization = useAddTokenToOrganization();
  const handleDone = useCallback(
    async (token: PaymentToken) => {
      await addTokenToOrganization(organizationId, token.id);
      onClose(token);
    },
    [addTokenToOrganization, organizationId, onClose]
  );

  const handleClose = useCallback(() => onClose(), [onClose]);

  return (
    <Modal
      visible={visible}
      title="Add Token"
      footer={null}
      onCancel={handleClose}
      destroyOnClose
    >
      <PaymentMethodEducationAlert />
      <PaymentTokenForm onDone={handleDone} />
    </Modal>
  );
};
