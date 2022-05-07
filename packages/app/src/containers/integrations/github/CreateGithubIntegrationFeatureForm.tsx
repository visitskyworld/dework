import { GithubRepo } from "@dewo/app/graphql/types";
import { useRunningCallback, useToggle } from "@dewo/app/util/hooks";
import { Alert, Button, Form, Space, Typography } from "antd";
import * as Icons from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";
import React, { FC, useCallback, useState } from "react";
import { useOrganizationGithubRepos } from "../../organization/hooks";
import { CreateIntegrationFeatureCard } from "../CreateIntegrationFeatureCard";
import {
  GithubProjectIntegrationFeature,
  useUpdateProjectIntegration,
} from "../hooks";
import { ProjectIntegration } from "../../../graphql/types";
import { SelectGihubRepoFormItem } from "./SelectGithubRepoFormItem";
import { deworkSocialLinks } from "@dewo/app/util/constants";
import { FormSection } from "@dewo/app/components/FormSection";
import { ImportGithubIssuesFormItem } from "./ImportGithubIssuesFormItem";

const getGithubIntegrationTypeTitle: Record<
  GithubProjectIntegrationFeature,
  string
> = {
  [GithubProjectIntegrationFeature.SHOW_BRANCHES]:
    "Link pull requests to tasks",
  [GithubProjectIntegrationFeature.SHOW_PULL_REQUESTS]:
    "Link pull requests to tasks",
  [GithubProjectIntegrationFeature.CREATE_ISSUES_FROM_TASKS]:
    "Create issues from tasks",
};

export interface CreateGithubIntegrationPayload {
  repo: GithubRepo;
  features: GithubProjectIntegrationFeature[];
  importIssues: boolean;
}

const getFeatures = (
  feature: GithubProjectIntegrationFeature
): GithubProjectIntegrationFeature[] => {
  if (feature === GithubProjectIntegrationFeature.SHOW_BRANCHES) {
    return [
      GithubProjectIntegrationFeature.SHOW_BRANCHES,
      GithubProjectIntegrationFeature.SHOW_PULL_REQUESTS,
    ];
  }
  return [feature];
};

export interface FormValues {
  githubRepoIds: string[];
  githubImportIssues?: boolean;
  githubFeatureCreateIssuesFromTasks?: boolean;
}

interface Props {
  feature: GithubProjectIntegrationFeature;
  existingIntegrations: ProjectIntegration[] | undefined;
  organizationId: string;
  disabled?: boolean;
  onSubmit(values: CreateGithubIntegrationPayload): Promise<void>;
}

export const CreateGithubIntegrationFeatureForm: FC<Props> = ({
  feature,
  existingIntegrations,
  organizationId,
  disabled = false,
  onSubmit,
}) => {
  const [form] = useForm<FormValues>();
  const [values, setValues] = useState<Partial<FormValues>>({});
  const expanded = useToggle(false);
  const githubRepos = useOrganizationGithubRepos(organizationId);

  const handleChange = useCallback(
    (_changed: Partial<FormValues>, values: Partial<FormValues>) => {
      setValues(values);
    },
    []
  );
  const updateIntegration = useUpdateProjectIntegration();
  const handleDelete = useCallback(
    async (id: string) => {
      await updateIntegration({
        id,
        deletedAt: new Date().toISOString(),
      });
    },
    [updateIntegration]
  );
  const [handleSubmit, submitting] = useRunningCallback(
    async (values: FormValues) => {
      if (!githubRepos) return;
      const repos = githubRepos.filter((r) =>
        values.githubRepoIds?.includes(r.id)
      );

      try {
        for (const repo of repos) {
          await onSubmit({
            repo,
            importIssues: !!values.githubImportIssues,
            features: getFeatures(feature),
          });
        }
      } finally {
        form.resetFields();
      }
    },
    [form, githubRepos, feature, onSubmit]
  );

  const connectedCopy =
    `Connected to ${existingIntegrations?.length} ` +
    (existingIntegrations?.length === 1 ? "repo" : "repos");

  return (
    <CreateIntegrationFeatureCard
      headerTitle={getGithubIntegrationTypeTitle[feature]}
      headerIcon={<Icons.GithubFilled />}
      isConnected={!!existingIntegrations?.length}
      connectedButtonCopy={connectedCopy}
      expanded={expanded}
      disabled={disabled}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onValuesChange={handleChange}
        onFinish={handleSubmit}
      >
        <Space direction="vertical">
          <Typography.Paragraph type="secondary" style={{ marginBottom: 8 }}>
            Learn more about this integration{" "}
            <a
              href={deworkSocialLinks.gitbook.connectingToGithub}
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>
            .
          </Typography.Paragraph>
          {!!existingIntegrations?.length && (
            <FormSection label={connectedCopy}>
              <Space direction="vertical">
                {existingIntegrations.map((integration) => (
                  <Alert
                    key={integration.id}
                    type="info"
                    message={
                      <Typography.Text>
                        Connected to{" "}
                        <Typography.Text className="font-semibold">
                          {integration.config.organization}/
                          {integration.config.repo}
                        </Typography.Text>
                      </Typography.Text>
                    }
                    icon={<Icons.CheckCircleFilled />}
                    showIcon
                    closable={!!integration.id}
                    onClose={() => handleDelete(integration.id)}
                  />
                ))}
              </Space>
            </FormSection>
          )}
          <FormSection label="Connect a repo">
            <SelectGihubRepoFormItem
              organizationId={organizationId}
              repos={githubRepos}
            />
            <ImportGithubIssuesFormItem
              hidden={!values.githubRepoIds?.length}
            />
          </FormSection>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            hidden={!values.githubRepoIds?.length}
          >
            Connect Github
          </Button>
        </Space>
      </Form>
    </CreateIntegrationFeatureCard>
  );
};
