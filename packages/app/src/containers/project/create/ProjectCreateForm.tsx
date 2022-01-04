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
import { ConnectProjectToGithubSelect } from "../../integrations/ConnectProjectToGithubSelect";
import { ConnectToGithubFormSection } from "../../integrations/ConnectToGithubFormSection";
import {
  useCreateDiscordProjectIntegration,
  useCreateGithubProjectIntegration,
} from "../../integrations/hooks";
import { ConnectOrganizationToDiscordButton } from "../../integrations/ConnectOrganizationToDiscordButton";
import { ConnectProjectToDiscordSelect } from "../../integrations/ConnectProjectToDiscordSelect";

interface FormValues extends CreateProjectInput {
  type?: "dev" | "non-dev";
  githubRepoId?: string;
  discordChannelId?: string;
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

  const [loading, setLoading] = useState(false);
  const handleSubmit = useCallback(
    async ({ type, githubRepoId, discordChannelId, ...input }: FormValues) => {
      try {
        setLoading(true);
        const project = await createProject(input);

        const repo = githubRepos?.find((r) => r.id === githubRepoId);
        if (!!repo) {
          await createGithubIntegration(project.id, repo);
        }

        const channel = discordChannels?.find((c) => c.id === discordChannelId);
        if (!!channel) {
          await createDiscordIntegration(project.id, channel);
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
    ]
  );

  const [values, setValues] = useState<Partial<FormValues>>({});
  const handleChange = useCallback(
    (_changed: Partial<FormValues>, values: Partial<FormValues>) =>
      setValues(values),
    []
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

        {!!organization && !hasDiscordIntegration && (
          <FormSection label="Discord Integration">
            <ConnectOrganizationToDiscordButton
              organizationId={organization.id}
            />
          </FormSection>
        )}
        {!!organization && hasDiscordIntegration && (
          <Form.Item name="discordChannelId" label="Connect Discord Channel">
            <ConnectProjectToDiscordSelect
              organizationId={organization.id}
              channels={discordChannels}
            />
          </Form.Item>
        )}

        <Form.Item
          label="Visibility"
          name="visibility"
          tooltip="By default all projects are public. Make a project private if you only want to share it with invited contributors."
        >
          <Radio.Group>
            <Radio.Button value={ProjectVisibility.PUBLIC}>Public</Radio.Button>
            <Radio.Button value={ProjectVisibility.PRIVATE}>
              Private
            </Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Project Type" name="type">
          <Radio.Group>
            <Radio.Button value="non-dev">Non-dev</Radio.Button>
            <Radio.Button value="dev">Development</Radio.Button>
          </Radio.Group>
        </Form.Item>

        {values.type === "dev" && !!organization && (
          <ConnectToGithubFormSection>
            {hasGithubIntegration ? (
              <Form.Item name="githubRepoId">
                <ConnectProjectToGithubSelect
                  organizationId={organizationId}
                  repos={githubRepos}
                  allowClear
                />
              </Form.Item>
            ) : (
              <ConnectOrganizationToGithubButton
                organizationId={organizationId}
              />
            )}
          </ConnectToGithubFormSection>
        )}

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
