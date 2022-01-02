import { ProjectDetails } from "@dewo/app/graphql/types";
import { Space } from "antd";
import React, { FC, useCallback, useMemo } from "react";
import { PaymentMethodSummary } from "../../payment/PaymentMethodSummary";
import { useUpdatePaymentMethod } from "../../payment/hooks";
import { AddPaymentMethodButton } from "../../payment/AddPaymentMethodButton";
import { ProjectGithubIntegration } from "./ProjectGithubIntegration";
import { FormSection } from "@dewo/app/components/FormSection";

interface Props {
  project: ProjectDetails;
}

export const ProjectSettings: FC<Props> = ({ project }) => {
  const updatePaymentMethod = useUpdatePaymentMethod();
  const removePaymentMethod = useCallback(
    (pm) =>
      updatePaymentMethod({ id: pm.id, deletedAt: new Date().toISOString() }),
    [updatePaymentMethod]
  );

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* <Col>
          <Typography.Title level={5}>Discord Integrations</Typography.Title>
          <ProjectDiscordIntegration
            projectId={project.id}
            organizationId={project.organizationId}
          />
        </Col> */}

        <ProjectGithubIntegration
          projectId={project.id}
          organizationId={project.organizationId}
        />

        <FormSection label="Payment Method">
          <Space direction="vertical" style={{ width: "100%" }}>
            {project.paymentMethods.map((paymentMethod) => (
              <PaymentMethodSummary
                key={paymentMethod.id}
                type={paymentMethod.type}
                address={paymentMethod.address}
                networkNames={paymentMethod.networks
                  .map((n) => n.name)
                  .join(", ")}
                onClose={() => removePaymentMethod(paymentMethod)}
              />
            ))}
            <AddPaymentMethodButton
              key={project.paymentMethods.length}
              selectTokens
              inputOverride={useMemo(
                () => ({ projectId: project.id }),
                [project.id]
              )}
              children="Add Payment Method"
            />
          </Space>
        </FormSection>
      </Space>
    </>
  );
};
