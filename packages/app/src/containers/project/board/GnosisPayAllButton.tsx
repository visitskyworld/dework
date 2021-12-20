import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { Task, TaskReward } from "@dewo/app/graphql/types";
import { useToggle } from "@dewo/app/util/hooks";
import { Button, Modal, Table, Tag } from "antd";
import React, { FC, useState } from "react";

interface Props {
  tasks: Task[];
}

const paymentEnabled = (task: Task) => task.reward?.amount === 0.008;

export const GnosisPayAllButton: FC<Props> = ({ tasks }) => {
  const modal = useToggle(true);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>(() =>
    tasks.filter(paymentEnabled).map((t) => t.id)
  );
  return (
    <>
      <Button type="primary" size="small" onClick={modal.toggleOn}>
        Pay Now ({tasks.length})
      </Button>
      <Modal
        visible={modal.isOn}
        width={768}
        title="Batch Pay Approved Tasks"
        footer={null}
        onCancel={modal.toggleOff}
      >
        <Table<Task>
          dataSource={tasks}
          size="small"
          rowKey="id"
          pagination={{ hideOnSinglePage: true }}
          // showHeader={false}
          rowSelection={{
            selectedRowKeys: selectedTaskIds,
            onChange: (taskIds) => setSelectedTaskIds(taskIds as string[]),
            getCheckboxProps: (task: Task) => ({
              disabled: task.reward?.amount !== 0.008,
            }),
          }}
          columns={[
            {
              key: "avatar",
              width: 1,
              render: (_, task: Task) => (
                <UserAvatar user={task.assignees[0]} />
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
              render: (reward: TaskReward) =>
                reward.amount === 0.008 ? (
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
