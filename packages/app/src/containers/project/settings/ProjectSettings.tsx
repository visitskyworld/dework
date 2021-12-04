import { Project } from "@dewo/app/graphql/types";
import { Alert, Col, Space, Typography } from "antd";
import React, { FC, useCallback } from "react";
import { shortenedAddress, useUpdateProject } from "../hooks";
import { ProjectDiscordIntegrations } from "./ProjectDiscordIntegrations";
import {
  paymentMethodTypeToString,
  ProjectPaymentMethodForm,
} from "./ProjectPaymentMethodForm";

interface Props {
  project: Project;
}

export const ProjectSettings: FC<Props> = ({ project }) => {
  const updateProject = useUpdateProject();
  const removePaymentMethod = useCallback(
    () => updateProject({ id: project.id, paymentMethodId: null }),
    [updateProject, project.id]
  );
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Typography.Title level={2} style={{ textAlign: "center" }}>
        Project Settings
      </Typography.Title>

      <Col>
        <Typography.Title level={5}>Discord Integrations</Typography.Title>
        <ProjectDiscordIntegrations />
      </Col>

      <Col>
        <Typography.Title level={5}>Reward Payment Method</Typography.Title>
        {!!project.paymentMethod ? (
          <Alert
            message={
              <Typography.Text>
                {paymentMethodTypeToString[project.paymentMethod.type]}{" "}
                connected
                <Typography.Text type="secondary">
                  {" "}
                  ({shortenedAddress(project.paymentMethod.address)})
                </Typography.Text>
              </Typography.Text>
            }
            type="success"
            showIcon
            closable
            onClose={removePaymentMethod}
          />
        ) : (
          <ProjectPaymentMethodForm projectId={project.id} />
        )}
      </Col>
    </Space>
  );
};
