import { Task, TaskStatusEnum } from "@dewo/app/graphql/types";
import { eatClick } from "@dewo/app/util/eatClick";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { Button, notification } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, useCallback, useState } from "react";
import {
  NoProjectPaymentMethodError,
  NoUserPaymentMethodError,
  usePayTaskReward,
} from "../../payment/hooks";
import { useUpdateTask } from "../../task/hooks";

interface Props {
  task: Task;
}

export const PayAndCloseButton: FC<Props> = ({ task }) => {
  const [loading, setLoading] = useState(false);

  // TODO(fant): remove this...
  const organizationId = useRouter().query.organizationId as string;

  const router = useRouter();

  const updateTask = useUpdateTask();
  const payTaskReward = usePayTaskReward();
  const handlePayAndClose = useCallback(
    async (event) => {
      eatClick(event);
      const receiver = task.assignees[0];
      try {
        setLoading(true);
        await payTaskReward(task, receiver);
        await updateTask({ id: task.id, status: TaskStatusEnum.DONE }, task);
      } catch (error) {
        if (error instanceof NoProjectPaymentMethodError) {
          notification.info({
            message: "Project has no payment method",
            description:
              "Set up a payment method to pay contributors in this project.",
            btn: (
              <RouterContext.Provider value={router}>
                <Link
                  href={`/organization/${organizationId}/project/${task.projectId}/settings`}
                >
                  <a>
                    <Button type="primary" onClick={notification.destroy}>
                      Setup payment
                    </Button>
                  </a>
                </Link>
              </RouterContext.Provider>
            ),
          });
        } else if (error instanceof NoUserPaymentMethodError) {
          notification.info({
            message: `${receiver.username} has no payment address`,
            description: `Please ask ${receiver.username} to set up a payment address in their user settings.`,
          });
        } else {
          notification.info({
            message: "Payment failed",
            description: (error as Error).message,
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [task, router, organizationId, payTaskReward, updateTask]
  );
  return (
    <Button
      loading={loading}
      size="small"
      type="primary"
      onClick={handlePayAndClose}
    >
      Pay and Close
    </Button>
  );
};
