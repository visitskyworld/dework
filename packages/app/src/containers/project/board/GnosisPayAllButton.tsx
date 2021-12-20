import { useMutation, useQuery } from "@apollo/client";
import * as Queries from "@dewo/app/graphql/queries";
import * as Mutations from "@dewo/app/graphql/mutations";
import _ from "lodash";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { ethers } from "ethers";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import {
  CreateTaskPaymentsInput,
  CreateTaskPaymentsMutation,
  CreateTaskPaymentsMutationVariables,
  GetTasksToPayQuery,
  GetTasksToPayQueryVariables,
  PaymentMethodType,
  TaskReward,
} from "@dewo/app/graphql/types";
import { useToggle } from "@dewo/app/util/hooks";
import { Button, Modal, notification, Table, Tag } from "antd";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useProposeTransaction } from "@dewo/app/util/gnosis";
import { useProject } from "../hooks";
import { useRouter } from "next/router";
import { uuidToBase62 } from "@dewo/app/util/uuid";
import Link from "next/link";

interface Props {
  projectId: string;
  taskIds: string[];
}

type TaskToPay = GetTasksToPayQuery["tasks"][number];

const userToPay = (task: TaskToPay) => task.assignees[0];
const canPayTaskAssignee = (task: TaskToPay) => !!userToPay(task).paymentMethod;

export function useCreateTaskPayments(): (
  input: CreateTaskPaymentsInput
) => Promise<void> {
  const [mutation] = useMutation<
    CreateTaskPaymentsMutation,
    CreateTaskPaymentsMutationVariables
  >(Mutations.createTaskPayments);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
    },
    [mutation]
  );
}

export const GnosisPayAllButton: FC<Props> = ({ projectId, taskIds }) => {
  const tasks = useQuery<GetTasksToPayQuery, GetTasksToPayQueryVariables>(
    Queries.tasksToPay,
    { variables: { taskIds } }
  ).data?.tasks;

  const project = useProject(projectId);

  const modal = useToggle();
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  useEffect(() => {
    if (!!tasks)
      setSelectedTaskIds(tasks.filter(canPayTaskAssignee).map((t) => t.id));
  }, [tasks]);

  const [loading, setLoading] = useState(false);
  const proposeTransaction = useProposeTransaction();
  const createTaskPayments = useCreateTaskPayments();
  const submit = useCallback(async () => {
    try {
      setLoading(true);

      const taskById = _.keyBy(tasks, "id");
      const tasksToPay = selectedTaskIds
        .map((taskId) => taskById[taskId])
        .filter((task): task is TaskToPay => !!task);

      const safeTxHash = await proposeTransaction(
        project!.paymentMethod!.address,
        tasksToPay.map((task) => ({
          to: userToPay(task).paymentMethod!.address,
          value: ethers.utils
            .parseEther(String(task.reward!.amount))
            .toString(),
          data: `0x${task.reward!.id.replace(/-/g, "")}`,
        }))
      );

      await createTaskPayments({
        taskRewardIds: tasksToPay.map((t) => t.reward!.id),
        paymentMethodId: project!.paymentMethod!.id,
        data: { safeTxHash },
      });
      modal.toggleOff();
    } finally {
      setLoading(false);
    }
  }, [
    proposeTransaction,
    createTaskPayments,
    project,
    selectedTaskIds,
    tasks,
    modal,
  ]);

  const router = useRouter();
  const handlePayNow = useCallback(() => {
    if (!project) return;
    if (project.paymentMethod?.type === PaymentMethodType.GNOSIS_SAFE) {
      modal.toggleOn();
    } else {
      notification.info({
        message: "Gnosis Safe not connected",
        description:
          "To batch pay for tasks, a Gnosis Safe needs to be connected to the project. Head to project settings to connect your Gnosis Safe to handle payouts.",
        btn: (
          <RouterContext.Provider value={router}>
            <Link
              href={`/o/${uuidToBase62(
                project.organizationId
              )}/p/${uuidToBase62(project.id)}/settings`}
            >
              <a>
                <Button type="primary" onClick={notification.destroy}>
                  Connect Gnosis Safe
                </Button>
              </a>
            </Link>
          </RouterContext.Provider>
        ),
      });
    }
  }, [project, modal, router]);

  if (!project) return null;
  return (
    <>
      <Button type="primary" size="small" onClick={handlePayNow}>
        Pay Now ({taskIds.length})
      </Button>
      <Modal
        visible={modal.isOn}
        width={768}
        title="Batch Pay Approved Tasks"
        footer={null}
        onCancel={modal.toggleOff}
      >
        <Table<TaskToPay>
          dataSource={tasks}
          size="small"
          rowKey="id"
          pagination={{ hideOnSinglePage: true }}
          // showHeader={false}
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
            {
              title: "Task",
              dataIndex: "name",
            },
            {
              title: "Payment",
              dataIndex: "reward",
              width: 1,
              render: (reward: TaskReward, task: TaskToPay) =>
                canPayTaskAssignee(task) ? (
                  `${reward.amount} ${reward.currency}`
                ) : (
                  <Tag color="red">Missing Payment Method</Tag>
                ),
            },
          ]}
        />
        <Button
          size="large"
          type="primary"
          loading={loading}
          disabled={!selectedTaskIds.length}
          onClick={submit}
          style={{
            display: "block",
            marginTop: 24,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Create Gnosis Transaction
        </Button>
      </Modal>
    </>
  );
};