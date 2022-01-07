import { GithubRepo } from "@dewo/app/graphql/types";
import { useToggle } from "@dewo/app/util/hooks";
import { Button, Checkbox, Form, Select, Tooltip, Typography } from "antd";
import { useForm } from "antd/lib/form/Form";
import * as Icons from "@ant-design/icons";
import React, { FC, useCallback, useState } from "react";
import { useOrganizationGithubRepos } from "../organization/hooks";
import { GithubProjectIntegrationFeature } from "./hooks";
import { FormSection } from "@dewo/app/components/FormSection";

export interface FormValues {
  githubRepoId: string;
  githubImportIssues?: boolean;
  githubFeatureCreateIssuesFromTasks?: boolean;
}

export interface CreateGithubIntegrationFormValues {
  repo: GithubRepo;
  features: GithubProjectIntegrationFeature[];
  importIssues: boolean;
}

interface Props {
  organizationId: string;
  onSubmit(values: CreateGithubIntegrationFormValues): Promise<void>;
}

interface FormFieldProps {
  values: Partial<FormValues>;
  repos?: GithubRepo[];
}

const initialValues: Partial<FormValues> = {
  githubImportIssues: true,
};

export const GithubIntegrationFormFields: FC<FormFieldProps> = ({
  values,
  repos,
}) => {
  return (
    <>
      <Typography.Paragraph type="secondary">
        Want to automatically link Github branches and make pull requests show
        up in tasks? Try out the Github integration for this project!
      </Typography.Paragraph>
      <Form.Item
        name="githubRepoId"
        rules={[{ required: true, message: "Please select a Github repo" }]}
      >
        <Select loading={!repos} placeholder="Select Github Repo" allowClear>
          {repos?.map((repo) => (
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
      <Form.Item
        name="githubImportIssues"
        valuePropName="checked"
        hidden={!values.githubRepoId}
        style={{ margin: 0 }}
      >
        <Checkbox>
          Import existing Github Issues to Dework{"  "}
          <Tooltip title="Easily move all your Github issues into Dework. New issues will be added and updated automatically.">
            <Icons.QuestionCircleOutlined />
          </Tooltip>
        </Checkbox>
      </Form.Item>
      <Form.Item
        name="githubFeatureCreateIssuesFromTasks"
        valuePropName="checked"
        hidden={!values.githubRepoId}
      >
        <Checkbox>
          Create Github Issue when Dework task is created{"  "}
          <Tooltip title="Automatically post Dework tasks to Github issues.">
            <Icons.QuestionCircleOutlined />
          </Tooltip>
        </Checkbox>
      </Form.Item>
    </>
  );
};

export const CreateGithubIntegrationForm: FC<Props> = ({
  organizationId,
  onSubmit,
}) => {
  const [form] = useForm<FormValues>();
  const [values, setValues] = useState<Partial<FormValues>>({});
  const handleChange = useCallback(
    (_changed: Partial<FormValues>, values: Partial<FormValues>) => {
      setValues(values);
    },
    []
  );

  const githubRepos = useOrganizationGithubRepos(organizationId);

  const submitting = useToggle();
  const handleSubmit = useCallback(
    async (values: FormValues) => {
      const repo = githubRepos?.find((r) => r.id === values.githubRepoId);
      if (!repo) return;

      try {
        submitting.toggleOn();
        await onSubmit({
          repo,
          importIssues: !!values.githubImportIssues,
          features: [
            GithubProjectIntegrationFeature.SHOW_BRANCHES,
            GithubProjectIntegrationFeature.SHOW_PULL_REQUESTS,
            ...(values.githubFeatureCreateIssuesFromTasks
              ? [GithubProjectIntegrationFeature.CREATE_ISSUES_FROM_TASKS]
              : []),
          ],
        });
      } finally {
        submitting.toggleOff();
      }
    },
    [submitting, githubRepos, onSubmit]
  );

  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark={false}
      initialValues={initialValues}
      onValuesChange={handleChange}
      onFinish={handleSubmit}
    >
      <FormSection label="Github Integration">
        <GithubIntegrationFormFields values={values} repos={githubRepos} />
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={submitting.isOn}
          hidden={!values.githubRepoId}
        >
          Connect Github
        </Button>
      </FormSection>
    </Form>
  );
};
