import React, { FC, useCallback, useMemo, useState } from "react";
import { Form, Button, Input, Typography, Select, Radio } from "antd";
import { useCreateProject, useCreateProjectIntegration } from "../hooks";
import {
  CreateProjectInput,
  OrganizationIntegrationType,
  Project,
  ProjectIntegrationType,
} from "@dewo/app/graphql/types";
import { FormSection } from "@dewo/app/components/FormSection";
import * as Icons from "@ant-design/icons";
import {
  useOrganization,
  useOrganizationGithubRepos,
} from "../../organization/hooks";
import { useConnectToGithubUrl } from "../settings/ProjectGithubIntegrations";

interface FormValues extends CreateProjectInput {
  type?: "dev" | "non-dev";
  githubRepoId?: string;
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
  const createProjectIntegration = useCreateProjectIntegration();

  const connectToGithubUrl = useConnectToGithubUrl(organizationId);
  const hasGithubIntegration = useMemo(
    () =>
      !!organization?.integrations.some(
        (i) => i.type === OrganizationIntegrationType.GITHUB
      ),
    [organization?.integrations]
  );
  const githubRepos = useOrganizationGithubRepos(
    organizationId,
    !hasGithubIntegration
  );

  const [loading, setLoading] = useState(false);
  const handleSubmit = useCallback(
    async ({ type, githubRepoId, ...input }: FormValues) => {
      try {
        setLoading(true);
        const project = await createProject(input);

        const repo = githubRepos?.find((r) => r.id === githubRepoId);
        if (!!repo) {
          await createProjectIntegration({
            projectId: project.id,
            type: ProjectIntegrationType.GITHUB,
            organizationIntegrationId: repo.integrationId,
            config: {
              repo: repo.name,
              organization: repo.organization,
              features: [],
            },
          });
        }

        await onCreated(project);
      } finally {
        setLoading(false);
      }
    },
    [createProject, createProjectIntegration, onCreated, githubRepos]
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
      initialValues={{ organizationId }}
      onFinish={handleSubmit}
      onValuesChange={handleChange}
    >
      <Form.Item
        label="Project Name"
        name="name"
        rules={[{ required: true, message: "Please enter a name" }]}
      >
        <Input placeholder="Enter a project name..." />
      </Form.Item>

      <Form.Item label="Project Type" name="type">
        <Radio.Group>
          <Radio.Button value="non-dev">Non-dev</Radio.Button>
          <Radio.Button value="dev">Development</Radio.Button>
        </Radio.Group>
      </Form.Item>

      {values.type === "dev" && !!organization && !hasGithubIntegration && (
        <FormSection label="Github Integration (optional)">
          <Typography.Paragraph style={{ marginBottom: 0 }}>
            Want to automatically link Github branches and make pull requests
            show up in tasks? Set up the Github integration for this project.
          </Typography.Paragraph>
          <Button
            type="ghost"
            style={{ marginTop: 4 }}
            icon={<Icons.GithubOutlined />}
            href={connectToGithubUrl}
          >
            Connect to Github
          </Button>
        </FormSection>
      )}
      {values.type === "dev" && !!organization && hasGithubIntegration && (
        <Form.Item name="githubRepoId" label="Connect Github repo">
          <Select
            loading={!githubRepos}
            placeholder="Select Github Repo"
            allowClear
          >
            {githubRepos?.map((repo) => (
              <Select.Option
                key={repo.id}
                value={repo.id}
                label={`${repo.organization}/${repo.name}`}
              >
                {`${repo.organization}/${repo.name}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
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
    </Form>
  );
};
