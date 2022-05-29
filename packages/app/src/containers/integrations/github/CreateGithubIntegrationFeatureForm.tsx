import { GithubRepo } from "@dewo/app/graphql/types";
import { useRunning, useToggle } from "@dewo/app/util/hooks";
import { Alert, Button, Form, Space, Typography } from "antd";
import * as Icons from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";
import React, { FC, useCallback, useMemo, useState } from "react";
import { useOrganizationGithubRepos } from "../../organization/hooks";
import { CreateIntegrationFeatureCard } from "../CreateIntegrationFeatureCard";
import {
  GithubProjectIntegrationFeature,
  useCreateGithubProjectIntegration,
  useUpdateProjectIntegration,
} from "../hooks";
import { ProjectIntegration } from "../../../graphql/types";
import { SelectGihubRepoFormItem } from "./SelectGithubRepoFormItem";
import { deworkSocialLinks } from "@dewo/app/util/constants";
import { FormSection } from "@dewo/app/components/FormSection";
import { ImportExistingGithubIssuesCheckbox } from "./ImportExistingGithubIssuesCheckbox";
import { HeadlessCollapse } from "@dewo/app/components/HeadlessCollapse";
import { CreateIssuesFromTasksCheckbox } from "./CreateIssuesFromTasksCheckbox";
import { useProject } from "../../project/hooks";
import { SelectGithubLabelsFormItem } from "./SelectGithubLabelsFormItem";
import _ from "lodash";

const getGithubIntegrationTypeTitle: Partial<
  Record<GithubProjectIntegrationFeature, string>
> = {
  [GithubProjectIntegrationFeature.SHOW_BRANCHES]:
    "Link pull requests to tasks",
  [GithubProjectIntegrationFeature.CREATE_TASKS_FROM_ISSUES]:
    "Create Dework tasks from Github issues",
};

export interface CreateGithubIntegrationPayload {
  repo: GithubRepo;
  features: GithubProjectIntegrationFeature[];
  importIssues: boolean;
}

const getFeatures = (values: FormValues): GithubProjectIntegrationFeature[] => {
  if (values.feature === GithubProjectIntegrationFeature.SHOW_BRANCHES) {
    return [
      GithubProjectIntegrationFeature.SHOW_BRANCHES,
      GithubProjectIntegrationFeature.SHOW_PULL_REQUESTS,
    ];
  }

  return [
    values.feature,
    values.options?.postTasksToGithub &&
      GithubProjectIntegrationFeature.CREATE_ISSUES_FROM_TASKS,
  ].filter((f): f is GithubProjectIntegrationFeature => !!f);
};

export interface FormValues {
  feature: GithubProjectIntegrationFeature;
  repoIds: string[];
  labelIds: string[];
  options?: {
    importExistingIssues?: boolean;
    postTasksToGithub?: boolean;
  };
}

interface Props {
  feature: GithubProjectIntegrationFeature;
  existingIntegrations: ProjectIntegration[] | undefined;
  projectId: string;
  disabled?: boolean;
}

export const CreateGithubIntegrationFeatureForm: FC<Props> = ({
  feature,
  existingIntegrations,
  projectId,
  disabled = false,
}) => {
  const [form] = useForm<FormValues>();
  const [values, setValues] = useState<Partial<FormValues>>({});
  const expanded = useToggle(false);

  const { project } = useProject(projectId);
  const githubRepos = useOrganizationGithubRepos(project?.organizationId);
  const githubRepoById = useMemo(
    () => _.keyBy(githubRepos, (r) => r.id),
    [githubRepos]
  );

  const handleChange = useCallback(
    (_changed: Partial<FormValues>, values: Partial<FormValues>) => {
      setValues(values);
    },
    []
  );
  const updateIntegration = useUpdateProjectIntegration();
  const handleDelete = useCallback(
    (id: string) =>
      updateIntegration({ id, deletedAt: new Date().toISOString() }),
    [updateIntegration]
  );

  const createIntegration = useCreateGithubProjectIntegration();
  const submit = useCallback(
    async (values: FormValues) => {
      const repos = githubRepos?.filter((r) => values.repoIds?.includes(r.id));
      if (!repos) return;

      for (const repo of repos) {
        await createIntegration({
          repo,
          projectId,
          labelIds: values.labelIds,
          importIssues: !!values.options?.importExistingIssues,
          features: getFeatures(values),
        });
      }
      form.resetFields();
      setValues({});
    },
    [form, githubRepos, projectId, createIntegration]
  );
  const [handleSubmit, submitting] = useRunning(submit);

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
        <Form.Item name="feature" hidden initialValue={feature} />
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
                {existingIntegrations.map((integration) => {
                  const { repo, organization, labelIds } = integration.config;
                  return (
                    <Alert
                      key={integration.id}
                      type="info"
                      message={
                        <Typography.Text>
                          Connected to{" "}
                          <Typography.Text className="font-semibold">
                            {organization}/{repo}
                          </Typography.Text>
                          {!!labelIds &&
                            (labelIds.length === 1
                              ? " (1 label)"
                              : ` (${labelIds.length}labels)`)}
                        </Typography.Text>
                      }
                      icon={<Icons.CheckCircleFilled />}
                      showIcon
                      closable={!!integration.id}
                      onClose={() => handleDelete(integration.id)}
                    />
                  );
                })}
              </Space>
            </FormSection>
          )}
          <FormSection label="Connect one or more repos">
            <SelectGihubRepoFormItem
              organizationId={project?.organizationId!}
              repos={githubRepos}
            />
          </FormSection>
          <HeadlessCollapse expanded={!!values.repoIds?.length}>
            {values.feature ===
              GithubProjectIntegrationFeature.CREATE_TASKS_FROM_ISSUES && (
              <>
                {/* TODO(fant): support filtering labels for multiple repos */}
                {values.repoIds?.length === 1 &&
                  values.repoIds
                    ?.filter((id) => !!githubRepoById[id])
                    .map((id) => (
                      <SelectGithubLabelsFormItem
                        key={id}
                        repo={githubRepoById[id]}
                        organizationId={project?.organizationId!}
                      />
                    ))}
                <ImportExistingGithubIssuesCheckbox />
                <CreateIssuesFromTasksCheckbox />
              </>
            )}
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              style={{ marginTop: 16 }}
            >
              Connect Github
            </Button>
          </HeadlessCollapse>
        </Space>
      </Form>
    </CreateIntegrationFeatureCard>
  );
};
