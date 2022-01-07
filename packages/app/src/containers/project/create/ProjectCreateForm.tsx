import React, { FC, useCallback, useMemo, useState } from "react";
import { Form, Button, Input, Radio, Space } from "antd";
import { useCreateProject } from "../hooks";
import {
  CreateProjectInput,
  OrganizationIntegrationType,
  Project,
  ProjectVisibility,
} from "@dewo/app/graphql/types";
import { FormSection } from "@dewo/app/components/FormSection";
import {
  useOrganization,
  useOrganizationDiscordChannels,
  useOrganizationGithubRepos,
} from "../../organization/hooks";
import { ConnectOrganizationToGithubButton } from "../../integrations/ConnectOrganizationToGithubButton";
import {
  useCreateDiscordProjectIntegration,
  useCreateGithubProjectIntegration,
} from "../../integrations/hooks";
import { ConnectOrganizationToDiscordButton } from "../../integrations/ConnectOrganizationToDiscordButton";
import {
  DiscordIntegrationFormFields,
  FormValues as DiscordFormFields,
} from "../../integrations/CreateDiscordIntegrationForm";
import { ProjectSettingsFormFields } from "../settings/ProjectSettingsFormFields";
import {
  GithubIntegrationFormFields,
  FormValues as GithubFormFields,
} from "../../integrations/CreateGithubIntegrationForm";

interface FormValues
  extends CreateProjectInput,
    Partial<DiscordFormFields>,
    Partial<GithubFormFields> {
  type?: "dev" | "non-dev";
}

interface ProjectCreateFormProps {
  organizationId: string;
  onCreated(project: Project): unknown;
}

export const ProjectCreateForm: FC<ProjectCreateFormProps> = ({
  organizationId,
  onCreated,
}) => {
  const organization = useOrganization(organizationId);

  const [values, setValues] = useState<Partial<FormValues>>({});
  const handleChange = useCallback(
    (_changed: Partial<FormValues>, values: Partial<FormValues>) =>
      setValues(values),
    []
  );

  const createProject = useCreateProject();
  const createDiscordIntegration = useCreateDiscordProjectIntegration();
  const createGithubIntegration = useCreateGithubProjectIntegration();

  const hasGithubIntegration = useMemo(
    () =>
      !!organization?.integrations.some(
        (i) => i.type === OrganizationIntegrationType.GITHUB
      ),
    [organization?.integrations]
  );
  const hasDiscordIntegration = useMemo(
    () =>
      !!organization?.integrations.some(
        (i) => i.type === OrganizationIntegrationType.DISCORD
      ),
    [organization?.integrations]
  );

  const githubRepos = useOrganizationGithubRepos(
    organizationId,
    !hasGithubIntegration
  );
  const discordChannels = useOrganizationDiscordChannels(
    { organizationId },
    !hasDiscordIntegration
  );
  const discordThreads = useOrganizationDiscordChannels(
    { organizationId, discordParentChannelId: values.discordChannelId },
    !hasDiscordIntegration
  );

  const [loading, setLoading] = useState(false);
  const handleSubmit = useCallback(
    async (values: FormValues) => {
      try {
        setLoading(true);
        const project = await createProject({
          name: values.name,
          visibility: values.visibility,
          organizationId: values.organizationId,
          options: values.options,
        });

        const repo = githubRepos?.find((r) => r.id === values.githubRepoId);
        if (!!repo) {
          await createGithubIntegration(project.id, repo);
        }

        const channel = discordChannels?.find(
          (c) => c.id === values.discordChannelId
        );
        const thread = discordThreads?.find(
          (c) => c.id === values.discordThreadId
        );
        if (!!channel && values.discordFeature) {
          await createDiscordIntegration({
            projectId: project.id,
            channel,
            thread,
            feature: values.discordFeature,
          });
        }

        await onCreated(project);
      } finally {
        setLoading(false);
      }
    },
    [
      createProject,
      createDiscordIntegration,
      createGithubIntegration,
      onCreated,
      githubRepos,
      discordChannels,
      discordThreads,
    ]
  );

  return (
    <Form<FormValues>
      layout="vertical"
      requiredMark={false}
      initialValues={{
        organizationId,
        visibility: ProjectVisibility.PUBLIC,
        type: "non-dev",
      }}
      onFinish={handleSubmit}
      onValuesChange={handleChange}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Form.Item
          label="Project Name"
          name="name"
          rules={[{ required: true, message: "Please enter a name" }]}
        >
          <Input placeholder="Enter a project name..." />
        </Form.Item>

        {!!organization && (
          <FormSection label="Discord Integration">
            {hasDiscordIntegration ? (
              <DiscordIntegrationFormFields
                values={values}
                channels={discordChannels}
                threads={discordThreads}
              />
            ) : (
              <ConnectOrganizationToDiscordButton
                organizationId={organization.id}
              />
            )}
          </FormSection>
        )}

        <Form.Item label="Project Type" name="type">
          <Radio.Group>
            <Radio.Button value="non-dev">Non-dev</Radio.Button>
            <Radio.Button value="dev">Development</Radio.Button>
          </Radio.Group>
        </Form.Item>

        {values.type === "dev" && !!organization && (
          <FormSection label="Github Integration">
            {hasDiscordIntegration ? (
              <GithubIntegrationFormFields
                values={values}
                repos={githubRepos}
              />
            ) : (
              <ConnectOrganizationToGithubButton
                organizationId={organizationId}
              />
            )}
          </FormSection>
        )}

        <ProjectSettingsFormFields />

        <Form.Item name="organizationId" hidden rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={loading}
        >
          Create
        </Button>
      </Space>
    </Form>
  );
};
