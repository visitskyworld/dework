import { GithubRepo } from "@dewo/app/graphql/types";
import { useToggle } from "@dewo/app/util/hooks";
import { Button, Checkbox, Form } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { FC, useCallback, useState } from "react";
import { useOrganizationGithubRepos } from "../../organization/hooks";
import { GithubProjectIntegrationFeature } from "../hooks";
import { QuestionmarkTooltip } from "@dewo/app/components/QuestionmarkTooltip";
import { SelectGihubRepoFormItem } from "./SelectGithubRepoFormItem";
import { ImportGithubIssuesFormItem } from "./ImportGithubIssuesFormItem";

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
  organizationId: string;
}

const initialValues: Partial<FormValues> = {
  githubImportIssues: true,
};

export const GithubIntegrationFormFields: FC<FormFieldProps> = ({
  values,
  repos,
  organizationId,
}) => (
  <>
    <SelectGihubRepoFormItem organizationId={organizationId} repos={repos} />
    <ImportGithubIssuesFormItem hidden={!values.githubRepoId} />
    <Form.Item
      name="githubFeatureCreateIssuesFromTasks"
      valuePropName="checked"
      hidden={!values.githubRepoId}
    >
      <Checkbox>
        Create Github Issue when Dework task is created
        <QuestionmarkTooltip
          title="Automatically post Dework tasks to Github issues."
          marginLeft={8}
        />
      </Checkbox>
    </Form.Item>
  </>
);

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
      <GithubIntegrationFormFields
        values={values}
        repos={githubRepos}
        organizationId={organizationId}
      />
      <Button
        type="primary"
        htmlType="submit"
        block
        loading={submitting.isOn}
        hidden={!values.githubRepoId}
      >
        Connect Github
      </Button>
    </Form>
  );
};
