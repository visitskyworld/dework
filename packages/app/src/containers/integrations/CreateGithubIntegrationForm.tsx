import { GithubRepo } from "@dewo/app/graphql/types";
import { useToggle } from "@dewo/app/util/hooks";
import { Button, Form, Select, Typography } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { FC, useCallback, useState } from "react";
import { useOrganizationGithubRepos } from "../organization/hooks";

export interface FormValues {
  githubRepoId: string;
}

export interface CreateGithubIntegrationFormValues {
  repo: GithubRepo;
}

interface Props {
  organizationId: string;
  onSubmit(values: CreateGithubIntegrationFormValues): Promise<void>;
}

interface FormFieldProps {
  values: Partial<FormValues>;
  repos?: GithubRepo[];
}

export const GithubIntegrationFormFields: FC<FormFieldProps> = ({ repos }) => {
  return (
    <>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 8 }}>
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
        await onSubmit({ repo });
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
      onValuesChange={handleChange}
      onFinish={handleSubmit}
    >
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
    </Form>
  );
};
