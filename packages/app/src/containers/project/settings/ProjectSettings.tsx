import { Project } from "@dewo/app/graphql/types";
import { Col, Space, Typography } from "antd";
import React, { FC, useCallback, useMemo } from "react";
import { ProjectDiscordIntegrations } from "./ProjectDiscordIntegrations";
import { PaymentMethodSummary } from "../../payment/PaymentMethodSummary";
import { ProjectGithubIntegration } from "./ProjectGithubIntegrations";
import { useUpdatePaymentMethod } from "../../payment/hooks";
import { AddPaymentMethodButton } from "../../payment/AddPaymentMethodButton";

interface Props {
  project: Project;
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
        <Col>
          <Typography.Title level={5}>Discord Integrations</Typography.Title>
          <ProjectDiscordIntegrations
            projectId={project.id}
            organizationId={project.organizationId}
          />
        </Col>

        <Col>
          <Typography.Title level={5}>Github Integrations</Typography.Title>
          <ProjectGithubIntegration
            projectId={project.id}
            organizationId={project.organizationId}
          />
        </Col>

        <Col>
          <Typography.Title level={5}>Reward Payment Method</Typography.Title>
          <Space direction="vertical" style={{ width: "100%" }}>
            {project.paymentMethods.map((paymentMethod) => (
              <PaymentMethodSummary
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
            />
          </Space>
        </Col>
      </Space>
    </>
  );
};
