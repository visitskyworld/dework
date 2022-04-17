import { Payment } from "@dewo/app/graphql/types";
import { Button, message, Modal } from "antd";
import React, { FC, useCallback, useState } from "react";
import { useClearPaymentReward } from "../../payment/hooks";

interface Props {
  payment: Payment;
  onDone?(): Promise<unknown>;
}

export const ClearTaskRewardPaymentButton: FC<Props> = ({
  children,
  payment,
  onDone,
}) => {
  const [loading, setLoading] = useState(false);

  const clearPaymentReward = useClearPaymentReward();
  const id = payment.id;

  const handleClear = useCallback(() => {
    const onOk = async () => {
      try {
        setLoading(true);
        await clearPaymentReward(id);
        await onDone?.();
      } catch (e: any) {
        message.error(e?.message || e);
      } finally {
        setLoading(false);
      }
    };
    Modal.confirm({
      icon: null,
      content:
        "Do this if you want to retry doing a payment that failed. This will detach the transaction from this task (and any other batched task if this was a batch payment)",
      onOk,
      okText: "Detach transaction",
    });
  }, [clearPaymentReward, id, onDone]);

  return (
    <Button loading={loading} size="small" type="primary" onClick={handleClear}>
      {children}
    </Button>
  );
};
