import { FormSection } from "@dewo/app/components/FormSection";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import {
  PaymentMethod,
  TaskReward,
  ThreepidSource,
} from "@dewo/app/graphql/types";
import { useSwitchChain } from "@dewo/app/util/ethereum";
import { useProposeTransaction } from "@dewo/app/util/gnosis";
import { useRunning } from "@dewo/app/util/hooks";
import { MetaTransactionData } from "@gnosis.pm/safe-core-sdk-types";
import { Button, notification, Row, Select, Table, Tag } from "antd";
import React, { FC, useCallback, useMemo, useState } from "react";
import { formatTaskReward } from "../../task/hooks";
import { shortenedAddress } from "../hooks";
import { AddProjectPaymentMethodButton } from "../project/AddProjectPaymentMethodButton";
import {
  canPayTaskAssignee,
  TaskToPay,
  useCreateTaskPayments,
  usePrepareGnosisTransaction,
  userToPay,
} from "./hooks";

interface Props {
  projectId: string;
  tasks: TaskToPay[];
  paymentMethods?: PaymentMethod[];
  onDone(): void;
}

export const BatchPayTable: FC<Props> = ({
  projectId,
  tasks,
  paymentMethods,
  onDone,
}) => {
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>(() =>
    tasks.filter(canPayTaskAssignee).map((t) => t.id)
  );
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
    string | undefined
  >(paymentMethods?.[0]?.id);
  const selectedPaymentMethod = useMemo(
    () => paymentMethods?.find((pm) => pm.id === selectedPaymentMethodId),
    [paymentMethods, selectedPaymentMethodId]
  );

  const proposeTransaction = useProposeTransaction();
  const createTaskPayments = useCreateTaskPayments();
  const switchChain = useSwitchChain();
  const prepareGnosisTransaction = usePrepareGnosisTransaction();
  const submit = useCallback(async () => {
    try {
      if (!selectedPaymentMethod) {
        throw new Error("No payment method selected");
      }

      const network = selectedPaymentMethod!.network;
      await switchChain(network);

      const tasksToPay = tasks.filter((t) => selectedTaskIds.includes(t.id));
      const transactions = await Promise.all(
        tasksToPay.map(async (task): Promise<MetaTransactionData> => {
          const toAddress = userToPay(task).threepids.find(
            (t) => t.source === ThreepidSource.metamask
          )!.address;
          return prepareGnosisTransaction(
            task.reward!,
            selectedPaymentMethod.address,
            toAddress,
            network
          );
        })
      );

      const safeTxHash = await proposeTransaction(
        selectedPaymentMethod.address,
        transactions,
        network
      );

      await createTaskPayments({
        taskRewardIds: tasksToPay.map((t) => t.reward!.id),
        networkId: network.id,
        paymentMethodId: selectedPaymentMethod.id,
        data: { safeTxHash },
      });
      onDone();
    } catch (error) {
      notification.info({
        message: "Payment failed",
        description: (error as Error).message,
      });
    }
  }, [
    proposeTransaction,
    createTaskPayments,
    switchChain,
    prepareGnosisTransaction,
    onDone,
    selectedTaskIds,
    selectedPaymentMethod,
    tasks,
  ]);
  const [handleSubmit, submitting] = useRunning(submit);

  return (
    <>
      <Table<TaskToPay>
        dataSource={tasks}
        size="small"
        rowKey="id"
        pagination={{ hideOnSinglePage: true }}
        rowSelection={{
          selectedRowKeys: selectedTaskIds,
          onChange: (taskIds) => setSelectedTaskIds(taskIds as string[]),
          getCheckboxProps: (task: TaskToPay) => ({
            disabled: !canPayTaskAssignee(task),
          }),
        }}
        columns={[
          {
            key: "avatar",
            width: 1,
            render: (_, task: TaskToPay) => (
              <UserAvatar user={userToPay(task)} />
            ),
          },
          { title: "Task", dataIndex: "name" },
          {
            title: "Payment",
            dataIndex: "reward",
            width: 120,
            render: (reward: TaskReward, task: TaskToPay) =>
              canPayTaskAssignee(task) ? (
                formatTaskReward(reward)
              ) : (
                <Tag color="red">
                  Contributor needs to add their payment address
                </Tag>
              ),
          },
        ]}
        footer={() => (
          <Row justify="end">
            {!!paymentMethods?.length ? (
              <FormSection
                label="Gnosis Safe:"
                style={{
                  display: "flex",
                  columnGap: 8,
                  alignItems: "center",
                  margin: 0,
                }}
              >
                <Select
                  size="small"
                  style={{ width: 130 }}
                  value={selectedPaymentMethodId}
                  onChange={setSelectedPaymentMethodId}
                >
                  {paymentMethods?.map((pm) => (
                    <Select.Option key={pm.id} value={pm.id}>
                      {shortenedAddress(pm.address)}
                    </Select.Option>
                  ))}
                </Select>
                <Button
                  type="primary"
                  size="small"
                  loading={submitting}
                  disabled={!selectedTaskIds.length || !selectedPaymentMethodId}
                  onClick={handleSubmit}
                >
                  Create Transaction
                </Button>
              </FormSection>
            ) : (
              <AddProjectPaymentMethodButton
                size="small"
                type="primary"
                projectId={projectId}
              >
                Setup payment
              </AddProjectPaymentMethodButton>
            )}
          </Row>
        )}
      />
    </>
  );
};
