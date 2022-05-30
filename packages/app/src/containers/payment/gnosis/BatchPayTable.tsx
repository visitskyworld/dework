import { FormSection } from "@dewo/app/components/FormSection";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import {
  PaymentMethod,
  PaymentToken,
  PaymentTokenType,
  TaskReward,
  TaskRewardPaymentInput,
  ThreepidSource,
  User,
} from "@dewo/app/graphql/types";
import { Constants } from "@dewo/app/util/constants";
import { useSwitchChain } from "@dewo/app/util/ethereum";
import { useProposeTransaction } from "@dewo/app/util/gnosis";
import { useRunning } from "@dewo/app/util/hooks";
import { MetaTransactionData } from "@gnosis.pm/safe-core-sdk-types";
import { Button, notification, Row, Select, Table, Tag } from "antd";
import { BigNumber } from "ethers";
import _ from "lodash";
import React, { FC, useCallback, useMemo, useState } from "react";
import { formatTaskReward } from "../../task/hooks";
import { shortenedAddress } from "../hooks";
import { AddProjectPaymentMethodButton } from "../project/AddProjectPaymentMethodButton";
import {
  TaskToPay,
  useCreateTaskPayments,
  usePrepareGnosisTransaction,
} from "./hooks";

interface Props {
  tasks: TaskToPay[];
  paymentMethods?: PaymentMethod[];
  onDone(): void;
}

interface Row {
  id: string;
  task: TaskToPay;
  reward: TaskReward;
  user: User;
  address: string | undefined;
  amount: string;
  token: PaymentToken;
}

export const BatchPayTable: FC<Props> = ({ tasks, paymentMethods, onDone }) => {
  const rows = useMemo<Row[]>(
    () =>
      tasks
        .map((task) => task.rewards.map((reward) => ({ task, reward })))
        .flat()
        .map(({ task, reward }) => {
          const usdPriceAccuracy = Math.pow(
            10,
            Constants.NUM_DECIMALS_IN_USD_PEG
          );
          const amount = reward.peggedToUsd
            ? BigNumber.from(reward.amount)
                .mul(BigNumber.from(10).pow(reward.token.exp))
                .mul(BigNumber.from(usdPriceAccuracy))
                .div(
                  BigNumber.from(
                    Math.round(reward.token.usdPrice! * usdPriceAccuracy)
                  )
                )
                .div(BigNumber.from(10).pow(Constants.NUM_DECIMALS_IN_USD_PEG))
            : BigNumber.from(reward.amount);

          if (
            [PaymentTokenType.ERC721, PaymentTokenType.ERC1155].includes(
              reward.token.type
            )
          ) {
            const canSplitNftsEqually = amount.mod(task.assignees.length).eq(0);
            if (!canSplitNftsEqually) {
              const user = task.assignees[0];
              return [
                {
                  id: [task.id, user.id].join("/"),
                  task,
                  reward,
                  user,
                  address: user.threepids.find(
                    (t) => t.source === ThreepidSource.metamask
                  )?.address,
                  token: reward.token,
                  amount: reward.amount,
                },
              ];
            }
          }

          return task.assignees.map((user) => ({
            id: [task.id, user.id].join("/"),
            task,
            reward,
            user,
            address: user.threepids.find(
              (t) => t.source === ThreepidSource.metamask
            )?.address,
            token: reward.token,
            amount: amount.div(task.assignees.length).toString(),
          }));
        })
        .flat(),
    [tasks]
  );

  const [selectedRowIds, setSelectedRowIds] = useState<string[]>(() =>
    rows.filter((r) => !!r.address).map((r) => r.id)
  );
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
    string | undefined
  >(paymentMethods?.[0]?.id);
  const selectedPaymentMethod = useMemo(
    () => paymentMethods?.find((pm) => pm.id === selectedPaymentMethodId),
    [paymentMethods, selectedPaymentMethodId]
  );

  const projectIdToCreateNewPaymentMethodIn = useMemo(
    () => tasks[0]?.projectId,
    [tasks]
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

      const rowsToPay = rows.filter(
        (r) => selectedRowIds.includes(r.id) && !!r.address
      );

      const payments: TaskRewardPaymentInput[] = rowsToPay.map((row) => ({
        rewardId: row.reward.id,
        userId: row.user.id,
        amount: row.amount,
        tokenId: row.token.id,
      }));
      const transactions = await Promise.all(
        rowsToPay.map(
          async (row): Promise<MetaTransactionData> =>
            prepareGnosisTransaction(
              row.amount,
              row.token,
              selectedPaymentMethod.address,
              row.address!,
              network
            )
        )
      );

      const safeTxHash = await proposeTransaction(
        selectedPaymentMethod.address,
        transactions,
        network
      );

      await createTaskPayments({
        payments,
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
    selectedRowIds,
    selectedPaymentMethod,
    rows,
  ]);
  const [handleSubmit, submitting] = useRunning(submit);

  return (
    <>
      <Table<Row>
        dataSource={rows}
        size="small"
        rowKey="id"
        pagination={{ hideOnSinglePage: true }}
        rowSelection={{
          selectedRowKeys: selectedRowIds,
          onChange: (ids) => setSelectedRowIds(ids as string[]),
          getCheckboxProps: (row) => ({ disabled: !row.address }),
        }}
        columns={[
          {
            key: "avatar",
            width: 1,
            render: (_, row) => <UserAvatar user={row.user} />,
          },
          { title: "Task", dataIndex: ["task", "name"] },
          {
            title: "Payment",
            key: "reward",
            width: 120,
            render: (_, row) =>
              !!row.address ? (
                formatTaskReward({
                  token: row.token,
                  amount: row.amount,
                  peggedToUsd: false,
                })
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
                  {_.uniqBy(paymentMethods, (pm) => pm.address).map((pm) => (
                    <Select.Option key={pm.id} value={pm.id}>
                      {shortenedAddress(pm.address)}
                    </Select.Option>
                  ))}
                </Select>
                <Button
                  type="primary"
                  size="small"
                  loading={submitting}
                  disabled={!selectedRowIds.length || !selectedPaymentMethodId}
                  onClick={handleSubmit}
                >
                  Create Transaction
                </Button>
              </FormSection>
            ) : (
              <AddProjectPaymentMethodButton
                size="small"
                type="primary"
                projectId={projectIdToCreateNewPaymentMethodIn}
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
