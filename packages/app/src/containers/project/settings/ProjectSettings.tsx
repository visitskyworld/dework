import { PaymentMethod, Project } from "@dewo/app/graphql/types";
import { Col, Space, Typography } from "antd";
import React, { FC, useCallback } from "react";
import { useUpdateProject } from "../hooks";
import { ProjectDiscordIntegrations } from "./ProjectDiscordIntegrations";
import { PaymentMethodForm } from "../../payment/PaymentMethodForm";
import { PaymentMethodSummary } from "../../payment/PaymentMethodSummary";
import { ProjectGithubIntegration } from "./ProjectGithubIntegrations";

interface Props {
  project: Project;
}

export const ProjectSettings: FC<Props> = ({ project }) => {
  const updateProject = useUpdateProject();

  const handlePaymentMethodCreated = useCallback(
    async (paymentMethod: PaymentMethod) => {
      await updateProject({
        id: project.id,
        paymentMethodId: paymentMethod.id,
      });
    },
    [updateProject, project.id]
  );
  const removePaymentMethod = useCallback(
    () => updateProject({ id: project.id, paymentMethodId: null }),
    [updateProject, project.id]
  );
  return (
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
        {!!project.paymentMethod ? (
          <PaymentMethodSummary
            paymentMethod={project.paymentMethod}
            onClose={removePaymentMethod}
          />
        ) : (
          <PaymentMethodForm onDone={handlePaymentMethodCreated} />
        )}
      </Col>
    </Space>
  );
};
