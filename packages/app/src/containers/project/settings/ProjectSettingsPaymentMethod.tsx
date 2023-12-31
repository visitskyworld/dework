import { ProjectDetails } from "@dewo/app/graphql/types";
import { Divider, Space, Typography } from "antd";
import React, { FC, useCallback } from "react";
import {
  useProjectPaymentMethods,
  useUpdatePaymentMethod,
} from "../../payment/hooks";
import { PaymentMethodSummary } from "../../payment/PaymentMethodSummary";
import { AddProjectPaymentMethodButton } from "../../payment/project/AddProjectPaymentMethodButton";

interface Props {
  project: ProjectDetails;
}

export const ProjectSettingsPaymentMethod: FC<Props> = ({ project }) => {
  const paymentMethods = useProjectPaymentMethods(project.id);
  const updatePaymentMethod = useUpdatePaymentMethod();
  const removePaymentMethod = useCallback(
    (pm) =>
      updatePaymentMethod({ id: pm.id, deletedAt: new Date().toISOString() }),
    [updatePaymentMethod]
  );

  return (
    <>
      <Typography.Title level={4} style={{ marginBottom: 4 }}>
        Payment Method
      </Typography.Title>

      <Divider style={{ marginTop: 0 }} />

      <Space direction="vertical" style={{ width: "100%" }}>
        {paymentMethods?.map((paymentMethod) => (
          <PaymentMethodSummary
            key={paymentMethod.id}
            type={paymentMethod.type}
            address={paymentMethod.address}
            networkName={paymentMethod.network.name}
            onClose={() => removePaymentMethod(paymentMethod)}
          />
        ))}
        <AddProjectPaymentMethodButton
          key={paymentMethods?.length}
          projectId={project.id}
          children="Add Payment Method"
        />
      </Space>
    </>
  );
};
