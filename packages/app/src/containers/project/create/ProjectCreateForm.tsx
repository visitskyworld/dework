import React, { FC, useCallback, useMemo, useState } from "react";
import { Form, Button, Input, Space, Typography, Switch, Row } from "antd";
import { useRouter } from "next/router";
import { useCreateProject } from "../hooks";
import {
  CreateProjectInput,
  OrganizationIntegrationType,
  Project,
  RulePermission,
} from "@dewo/app/graphql/types";
import { FormSection } from "@dewo/app/components/FormSection";
import {
  useOrganizationDetails,
  useOrganizationDiscordChannels,
  useOrganizationGithubRepos,
  useOrganizationIntegrations,
} from "../../organization/hooks";
import {
  DiscordProjectIntegrationFeature,
  GithubProjectIntegrationFeature,
  useCreateDiscordProjectIntegration,
  useCreateGithubProjectIntegration,
} from "../../integrations/hooks";
import {
  DiscordIntegrationFormFields,
  FormValues as DiscordFormFields,
} from "../../integrations/discord/CreateDiscordIntegrationForm";
import { FormValues as GithubFormFields } from "../../integrations/github/CreateGithubIntegrationForm";
import _ from "lodash";
import { ConnectOrganizationToDiscordButton } from "../../integrations/discord/ConnectOrganizationToDiscordButton";
import { useToggle } from "@dewo/app/util/hooks";
import {
  useCreateRole,
  useCreateRule,
  useOrganizationRoles,
} from "../../rbac/hooks";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { MoreSectionCollapse } from "@dewo/app/components/MoreSectionCollapse";

export interface FormValues
  extends CreateProjectInput,
    Partial<DiscordFormFields>,
    Partial<GithubFormFields> {
  private: boolean;
}

const formValueFieldsToRememberThroughOauthFlow: (keyof FormValues)[] = [
  "name",
  "sectionId",
  "private",
];

interface ProjectCreateFormProps {
  organizationId: string;
  onCreated(project: Project): unknown;
}

export const ProjectCreateForm: FC<ProjectCreateFormProps> = ({
  organizationId,
  onCreated,
}) => {
  const advancedSection = useToggle(true);
  const { organization } = useOrganizationDetails(organizationId);
  const router = useRouter();

  const [values, setValues] = useState<Partial<FormValues>>({});
  const handleChange = useCallback(
    (_changed: Partial<FormValues>, values: Partial<FormValues>) =>
      setValues(values),
    []
  );

  const createProject = useCreateProject();
  const createDiscordIntegration = useCreateDiscordProjectIntegration();
  const createGithubIntegration = useCreateGithubProjectIntegration();

  const hasGithubIntegration = !!useOrganizationIntegrations(
    organizationId,
    OrganizationIntegrationType.GITHUB
  )?.length;
  const hasDiscordIntegration = !!useOrganizationIntegrations(
    organizationId,
    OrganizationIntegrationType.DISCORD
  )?.length;

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

  const { user } = useAuthContext();
  const createRole = useCreateRole();
  const createRule = useCreateRule();
  const roles = useOrganizationRoles(values.organizationId);

  const [loading, setLoading] = useState(false);
  const handleSubmit = useCallback(
    async (values: FormValues) => {
      try {
        setLoading(true);
        const project = await createProject({
          name: values.name,
          sectionId: values.sectionId,
          organizationId: values.organizationId,
          options: { showCommunitySuggestions: true },
        });

        const repo = githubRepos?.find((r) => r.id === values.githubRepoId);
        if (!!repo) {
          await createGithubIntegration({
            repo,
            projectId: project.id,
            importIssues: !!values.githubImportIssues,
            features: [
              GithubProjectIntegrationFeature.SHOW_BRANCHES,
              GithubProjectIntegrationFeature.SHOW_PULL_REQUESTS,
              ...(values.githubFeatureCreateIssuesFromTasks
                ? [GithubProjectIntegrationFeature.CREATE_ISSUES_FROM_TASKS]
                : []),
            ],
          });
        }

        const channel = discordChannels.value?.find(
          (c) => c.id === values.discordChannelId
        );
        const thread = discordThreads.value?.find(
          (c) => c.id === values.discordThreadId
        );
        if (!!channel && values.discordFeature) {
          await createDiscordIntegration({
            projectId: project.id,
            channel,
            thread,
            features: [
              values.discordFeature,
              ...(values.discordFeaturePostNewTasksEnabled
                ? [DiscordProjectIntegrationFeature.POST_NEW_TASKS_TO_CHANNEL]
                : []),
            ],
          });
        }

        if (values.private) {
          const personalRole =
            roles?.find((r) => r.userId === user!.id) ??
            (await createRole({
              name: "",
              color: "",
              organizationId: values.organizationId,
              userId: user!.id,
            }));
          await createRule({
            permission: RulePermission.VIEW_PROJECTS,
            projectId: project.id,
            roleId: personalRole.id,
          });

          const fallbackRole = roles?.find((r) => r.fallback);
          await createRule({
            permission: RulePermission.VIEW_PROJECTS,
            projectId: project.id,
            inverted: true,
            roleId: fallbackRole!.id,
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
      discordChannels.value,
      discordThreads.value,
      createRole,
      createRule,
      roles,
      user,
    ]
  );

  const initialValues = useMemo<Partial<FormValues>>(() => {
    const initialValues: Partial<FormValues> = {
      organizationId,
      private: false,
    };

    try {
      Object.assign(
        initialValues,
        _.pick(router.query, formValueFieldsToRememberThroughOauthFlow)
      );
    } finally {
      return initialValues;
    }
  }, [organizationId, router.query]);

  return (
    <Form<FormValues>
      layout="vertical"
      requiredMark={false}
      initialValues={initialValues}
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
        <FormSection style={{ margin: 0, marginTop: 8 }} label="Visibility">
          <Typography.Paragraph style={{ marginBottom: 0 }} type="secondary">
            {!!values.private
              ? "You can change who can view your project later in the project settings"
              : "Anyone can view this project and its tasks"}
          </Typography.Paragraph>
          <Row align="middle" style={{ gap: 8, marginBottom: 8 }}>
            <Typography.Text>Private project</Typography.Text>
            <Form.Item
              name="private"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Switch checked={!!values.private} />
            </Form.Item>
          </Row>
        </FormSection>
        <MoreSectionCollapse label="Advanced" toggle={advancedSection}>
          {!!organization && (
            <FormSection label="Discord Integration">
              {hasDiscordIntegration ? (
                <DiscordIntegrationFormFields
                  values={values}
                  channels={discordChannels.value}
                  threads={discordThreads.value}
                  organizationId={organizationId}
                  onRefetchChannels={discordChannels.refetch}
                />
              ) : (
                <ConnectOrganizationToDiscordButton
                  organizationId={organization.id}
                />
              )}
            </FormSection>
          )}
        </MoreSectionCollapse>
        <Form.Item name="sectionId" hidden />
        <Form.Item name="organizationId" hidden rules={[{ required: true }]} />
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={loading}
        >
          Create
        </Button>
        <Typography.Paragraph type="secondary" style={{ textAlign: "center" }}>
          All settings above can be changed later!
        </Typography.Paragraph>
      </Space>
    </Form>
  );
};
