import React, { FC, useCallback, useState } from "react";
import { Form, Input } from "antd";
import { useCreateOrganization } from "../hooks";
import { CreateOrganizationInput, Organization } from "@dewo/app/graphql/types";
import { useForm } from "antd/lib/form/Form";
import {
  OrganizationCreateFormSubmitButton,
  OrganizationCreateFormSubmitButtonOptions,
} from "./OrganizationCreateFormSubmitButton";
import { Constants } from "@dewo/app/util/constants";
import { useRouter } from "next/router";

interface OrganizationCreateFormProps {
  onCreated(organization: Organization): unknown;
}

type FormValues = CreateOrganizationInput &
  OrganizationCreateFormSubmitButtonOptions;

export const OrganizationCreateForm: FC<OrganizationCreateFormProps> = ({
  onCreated,
}) => {
  const [form] = useForm<FormValues>();
  const createOrganization = useCreateOrganization();

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleSubmit = useCallback(
    async (values: FormValues) => {
      try {
        setLoading(true);
        const organization = await createOrganization({
          name: values.name,
        });

        if (!!values.importFromNotion) {
          const url = `${
            Constants.GRAPHQL_API_URL
          }/auth/notion?state=${JSON.stringify({
            redirect: `${organization.permalink}/notion-import`,
          })}`;
          window.location.href = url;
        } else {
          await router.push(organization.permalink);
        }

        await onCreated(organization);
      } finally {
        setLoading(false);
      }
    },
    [createOrganization, onCreated, router]
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
          className="ant-typography-h4"
          style={{ textAlign: "center" }}
          placeholder="Enter organization name..."
        />
      </Form.Item>
      <Form.Item name="importFromNotion" hidden />

      <OrganizationCreateFormSubmitButton
        type="primary"
        size="large"
        block
        loading={loading}
        onClick={handleClickSubmit}
      >
        Create
      </OrganizationCreateFormSubmitButton>
    </Form>
  );
};
