import { useQuery } from "@apollo/client";
import * as Queries from "@dewo/app/graphql/queries";
import _ from "lodash";
import {
  GetTasksToPayQuery,
  GetTasksToPayQueryVariables,
  PaymentMethod,
  PaymentMethodType,
} from "@dewo/app/graphql/types";
import { useToggle } from "@dewo/app/util/hooks";
import { Button, Divider, Modal, Spin } from "antd";
import React, { FC, Fragment, useMemo } from "react";
import { usePaymentNetworks } from "../hooks";
import { BatchPayTable } from "./BatchPayTable";
import { TaskToPay } from "./hooks";

interface Props {
  taskIds: string[];
  paymentMethods: PaymentMethod[];
}

export const BatchPayButton: FC<Props> = ({ taskIds, paymentMethods }) => {
  const modal = useToggle();

  const tasks = useQuery<GetTasksToPayQuery, GetTasksToPayQueryVariables>(
    Queries.tasksToPay,
    { variables: { input: { ids: taskIds } } }
  ).data?.tasks;

  const tasksByNetworkId = useMemo<Record<string, TaskToPay[]>>(
    () =>
      (tasks ?? []).reduce<Record<string, TaskToPay[]>>((acc, task) => {
        for (const reward of task.rewards) {
          const networkId = reward.token.networkId;
          if (networkId) {
            acc[networkId] = [...(acc[networkId] || []), task];
          }
        }
        return acc;
      }, {}),
    [tasks]
  );

  const paymentMethodsByNetworkId = useMemo<Record<string, PaymentMethod[]>>(
    () =>
      _.groupBy(
        paymentMethods.filter(
          (pm) => pm.type === PaymentMethodType.GNOSIS_SAFE
        ),
        (pm) => pm.network.id
      ),
    [paymentMethods]
  );

  const networks = usePaymentNetworks();
  const networksWithTasks = useMemo(
    () => networks?.filter((n) => !!tasksByNetworkId[n.id]?.length),
    [tasksByNetworkId, networks]
  );

  const shouldShow = useMemo(
    () =>
      !!paymentMethods.some((pm) => pm.type === PaymentMethodType.GNOSIS_SAFE),
    [paymentMethods]
  );

  if (!shouldShow) return null;
  return (
    <>
      <Button type="primary" size="small" onClick={modal.toggleOn}>
        Pay Now ({taskIds.length})
      </Button>
      <Modal
        visible={modal.isOn}
        width={768}
        footer={null}
        onCancel={modal.toggleOff}
      >
        {!!networksWithTasks && !!tasks ? (
          networksWithTasks.map((network) => (
            <Fragment key={network.id}>
              <Divider style={{ marginTop: 40 }}>{network.name}</Divider>
              <BatchPayTable
                tasks={tasksByNetworkId[network.id]}
                paymentMethods={paymentMethodsByNetworkId[network.id]}
                onDone={modal.toggleOff}
              />
            </Fragment>
          ))
        ) : (
          <div style={{ display: "grid", placeItems: "center" }}>
            <Spin />
          </div>
        )}
      </Modal>
    </>
  );
};
