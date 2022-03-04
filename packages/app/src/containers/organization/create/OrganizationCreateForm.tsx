import React, { FC, ReactElement, useCallback, useState } from "react";
import { Form, Input } from "antd";
import { useCreateOrganization } from "../hooks";
import { CreateOrganizationInput, Organization } from "@dewo/app/graphql/types";
import { useForm } from "antd/lib/form/Form";
import {
  OrganizationCreateFormSubmitButton,
  OrganizationCreateFormSubmitButtonOptions,
  OrganizationCreateFormSubmitButtonProps,
} from "./OrganizationCreateFormSubmitButton";
import { Constants } from "@dewo/app/util/constants";
import { useRouter } from "next/router";
import { useCreateProject } from "../../project/hooks";
import { useConnectToGithubUrlFn } from "../../integrations/hooks";

interface OrganizationCreateFormProps {
  onCreated(organization: Organization): unknown;
  renderSubmitButton?(
    props: OrganizationCreateFormSubmitButtonProps
  ): ReactElement | undefined;
}

type FormValues = CreateOrganizationInput &
  OrganizationCreateFormSubmitButtonOptions;

export const OrganizationCreateForm: FC<OrganizationCreateFormProps> = ({
  onCreated,
  renderSubmitButton,
}) => {
  const [form] = useForm<FormValues>();
  const createOrganization = useCreateOrganization();
  const createProject = useCreateProject();
  const createConnectToGithubUrl = useConnectToGithubUrlFn();

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleSubmit = useCallback(
    async (values: FormValues) => {
      try {
        setLoading(true);
        const organization = await createOrganization({
          name: values.name,
        });

        switch (values.import) {
          case "github":
            window.location.href = createConnectToGithubUrl(organization.id, {
              appUrl: `${organization.permalink}/import/github`,
            });
            break;
          case "notion": {
            const url = `${
              Constants.GRAPHQL_API_URL
            }/auth/notion?state=${JSON.stringify({
              redirect: `${organization.permalink}/import/notion`,
            })}`;
            window.location.href = url;
            break;
          }
          case "trello": {
            const url = `${
              Constants.GRAPHQL_API_URL
            }/auth/trello?state=${JSON.stringify({
              redirect: `${organization.permalink}/import/trello`,
            })}`;
            window.location.href = url;
            break;
          }
          default:
            const project = await createProject({
              name: "Main Project",
              organizationId: organization.id,
            });
            await router.push(project.permalink);
            break;
        }

        await onCreated(organization);
      } finally {
        setLoading(false);
      }
    },
    [
      createOrganization,
      createProject,
      createConnectToGithubUrl,
      onCreated,
      router,
    ]
  );

  const handleClickSubmit = useCallback(
    (options?: OrganizationCreateFormSubmitButtonOptions) => {
      if (!!options) {
        form.setFields(
          Object.keys(options).map((key) => ({
            name: key,
            value: options[key as keyof typeof options],
          }))
        );
      }

      form.submit();
    },
    [form]
  );

  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark={false}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="name"
        rules={[{ required: true, message: "Please enter a name" }]}
      >
        <Input
          autoFocus
          className="ant-typography-h4"
          style={{ textAlign: "center" }}
          placeholder="Enter organization name..."
        />
      </Form.Item>
      <Form.Item name="import" hidden />

      {renderSubmitButton?.({
        type: "primary",
        size: "large",
        block: true,
        loading,
        onClick: handleClickSubmit,
        children: "Create",
      }) ?? (
        <OrganizationCreateFormSubmitButton
          type="primary"
          size="large"
          block
          loading={loading}
          onClick={handleClickSubmit}
          children="Create"
        />
      )}
    </Form>
  );
};
