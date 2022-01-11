import {
  PaymentToken,
  ProjectDetails,
  ProjectRole,
  UpdateProjectInput,
} from "@dewo/app/graphql/types";
import { Form, Input, Space } from "antd";
import React, { FC, useCallback, useMemo } from "react";
import { PaymentMethodSummary } from "../../payment/PaymentMethodSummary";
import { useUpdatePaymentMethod } from "../../payment/hooks";
import { AddPaymentMethodButton } from "../../payment/AddPaymentMethodButton";
import { ProjectGithubIntegration } from "./ProjectGithubIntegration";
import { FormSection } from "@dewo/app/components/FormSection";
import { ProjectMemberList } from "./ProjectMemberList";
import { ProjectInviteButton } from "../../invite/ProjectInviteButton";
import { ProjectDiscordIntegration } from "./ProjectDiscordIntegration";
import { ProjectSettingsFormFields } from "./ProjectSettingsFormFields";
import { useUpdateProject } from "../hooks";
import { ProjectSettingsDangerZone } from "./ProjectSettingsDangerZone";
import { ProjectTokenGatingInput } from "./ProjectTokenGatingInput";
import {
  useCreateProjectInvite,
  useDeleteProjectInvite,
} from "../../invite/hooks";

interface Props {
  project: ProjectDetails;
}

export const ProjectSettings: FC<Props> = ({ project }) => {
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

  const tokenGatedInvite = project.tokenGatedInvites[0];
  const createProjectInvite = useCreateProjectInvite();
  const deleteProjectInvite = useDeleteProjectInvite();
  const handleChangeTokenGating = useCallback(
    async (token: PaymentToken | undefined) => {
      if (!!token) {
        await createProjectInvite({
          projectId: project.id,
          tokenId: token.id,
          role: ProjectRole.CONTRIBUTOR,
        });
      } else {
        await deleteProjectInvite({
          projectId: project.id,
          tokenId: tokenGatedInvite.token?.id,
          role: ProjectRole.CONTRIBUTOR,
        });
      }
    },
    [createProjectInvite, deleteProjectInvite, tokenGatedInvite, project.id]
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
            <AddPaymentMethodButton
              key={project.paymentMethods.length}
              type="ghost"
              selectTokens
              inputOverride={useMemo(
                () => ({ projectId: project.id }),
                [project.id]
              )}
              children="Add Payment Method"
            />
          </Space>
        </FormSection>

        <ProjectTokenGatingInput
          value={tokenGatedInvite?.token ?? undefined}
          onChange={handleChangeTokenGating}
        />

        <Form<UpdateProjectInput>
          layout="vertical"
          requiredMark={false}
          initialValues={initialValues}
          onValuesChange={handleUpdateProject}
        >
          <ProjectSettingsFormFields />
          <ProjectSettingsDangerZone project={project} />
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
        </Form>

        <FormSection label="Members">
          <ProjectMemberList projectId={project.id} />
          <ProjectInviteButton
            projectId={project.id}
            style={{ marginTop: 8 }}
          />
        </FormSection>
      </Space>
    </>
  );
};
