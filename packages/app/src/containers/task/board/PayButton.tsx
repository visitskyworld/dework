import { Task } from "@dewo/app/graphql/types";
import { eatClick } from "@dewo/app/util/eatClick";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { Button, ButtonProps, notification } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, useCallback, useState } from "react";
import {
  NoProjectPaymentMethodError,
  NoUserPaymentMethodError,
  usePayTaskReward,
} from "../../payment/hooks";
import { useProject } from "../../project/hooks";

interface Props extends ButtonProps {
  task: Task;
  onDone?(): Promise<unknown>;
}

export const PayButton: FC<Props> = ({
  children,
  task,
  onDone,
  ...buttonProps
}) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { project } = useProject(task.projectId);

  const payTaskReward = usePayTaskReward();
  const handlePayAndClose = useCallback(
    async (event) => {
      eatClick(event);
      const receiver = task.assignees[0];
      try {
        setLoading(true);
        await payTaskReward(task, receiver);
        await onDone?.();
      } catch (error) {
        console.error(error);
        if (error instanceof NoProjectPaymentMethodError) {
          notification.info({
            message: "The project has no payment method",
            description:
              "Set up a payment method to pay contributors in this project.",
            btn: (
              <RouterContext.Provider value={router}>
                <Link href={`${project!.permalink}/settings/payment-method`}>
                  <a>
                    <Button
                      type="primary"
                      onClick={notification.destroy}
                      {...buttonProps}
                    >
                      Setup payment
                    </Button>
                  </a>
                </Link>
              </RouterContext.Provider>
            ),
          });
        } else if (error instanceof NoUserPaymentMethodError) {
          notification.info({
            message: error.message,
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
    [task, payTaskReward, onDone, router, project, buttonProps]
  );
  return (
    <Button
      loading={loading}
      size="small"
      type="primary"
      onClick={handlePayAndClose}
      {...buttonProps}
    >
      {children}
    </Button>
  );
};
