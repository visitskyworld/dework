import {
  PaymentToken,
  ProjectDetails,
  ProjectVisibility,
  UpdateProjectInput,
} from "@dewo/app/graphql/types";
import { Form, Input, Space } from "antd";
import React, { FC, useCallback, useMemo } from "react";
import { PaymentMethodSummary } from "../../payment/PaymentMethodSummary";
import { useUpdatePaymentMethod } from "../../payment/hooks";
import { ProjectGithubIntegration } from "./ProjectGithubIntegration";
import { FormSection } from "@dewo/app/components/FormSection";
import { ProjectMemberList } from "./ProjectMemberList";
import { ProjectInviteButton } from "../../invite/ProjectInviteButton";
import { ProjectDiscordIntegration } from "./ProjectDiscordIntegration";
import { ProjectSettingsFormFields } from "./ProjectSettingsFormFields";
import {
  useCreateProjectTokenGate,
  useDeleteProjectTokenGate,
  useUpdateProject,
} from "../hooks";
import { ProjectSettingsDangerZone } from "./ProjectSettingsDangerZone";
import { ProjectTokenGatingInput } from "./ProjectTokenGatingInput";
import { AddProjectPaymentMethodButton } from "../../payment/project/AddProjectPaymentMethodButton";
import { useToggle } from "@dewo/app/util/hooks";
import { ProjectTaskExports } from "./ProjectTaskExports";
import { useForm } from "antd/lib/form/Form";

interface Props {
  project: ProjectDetails;
}

export const ProjectSettings: FC<Props> = ({ project }) => {
  const [form] = useForm<UpdateProjectInput>();

  const advancedSection = useToggle(true);
  const updateProject = useUpdateProject();
  const handleUpdateProject = useCallback(
    (changed: Partial<UpdateProjectInput>) =>
      updateProject({ id: project.id, ...changed }),
    [updateProject, project.id]
  );

  const updatePaymentMethod = useUpdatePaymentMethod();
  const removePaymentMethod = useCallback(
    (pm) =>
      updatePaymentMethod({ id: pm.id, deletedAt: new Date().toISOString() }),
    [updatePaymentMethod]
  );

  const initialValues = useMemo(
    () => ({
      id: project.id,
      visibility: project.visibility,
      options: project.options,
    }),
    [project]
  );

  const tokenGate = project.tokenGates[0];
  const createProjectTokenGate = useCreateProjectTokenGate();
  const deleteProjectTokenGate = useDeleteProjectTokenGate();
  const handleChangeTokenGating = useCallback(
    async (token: PaymentToken | undefined) => {
      if (!!token && !tokenGate) {
        await createProjectTokenGate({
          projectId: project.id,
          tokenId: token.id,
        });
        if (project.visibility !== ProjectVisibility.PRIVATE) {
          form.setFields([
            { name: "visibility", value: ProjectVisibility.PRIVATE },
          ]);
          await updateProject({
            id: project.id,
            visibility: ProjectVisibility.PRIVATE,
          });
        }
      } else {
        await deleteProjectTokenGate({
          projectId: project.id,
          tokenId: tokenGate.token.id,
        });
      }
    },
    [
      createProjectTokenGate,
      deleteProjectTokenGate,
      tokenGate,
      updateProject,
      project.id,
      project.visibility,
      form,
    ]
  );

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <ProjectDiscordIntegration
          projectId={project.id}
          organizationId={project.organizationId}
        />

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
            <AddProjectPaymentMethodButton
              key={project.paymentMethods.length}
              type="ghost"
              projectId={project.id}
              children="Add Payment Method"
            />
          </Space>
        </FormSection>

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          initialValues={initialValues}
          onValuesChange={handleUpdateProject}
        >
          <ProjectSettingsFormFields toggle={advancedSection} />
          {advancedSection.isOn && (
            <>
              <ProjectTaskExports
                projectId={project.id}
                projectName={project.name}
              />
              <ProjectTokenGatingInput
                value={tokenGate?.token ?? undefined}
                onChange={handleChangeTokenGating}
              />
              <ProjectSettingsDangerZone project={project} />
              <Form.Item name="id" hidden>
                <Input />
              </Form.Item>
            </>
          )}
        </Form>
        {advancedSection.isOn && (
          <FormSection label="Members">
            <ProjectMemberList projectId={project.id} />
            <ProjectInviteButton
              projectId={project.id}
              style={{ marginTop: 8 }}
            />
          </FormSection>
        )}
      </Space>
    </>
  );
};
