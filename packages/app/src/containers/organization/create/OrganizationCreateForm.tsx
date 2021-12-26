import React, { FC, useCallback, useState } from "react";
import { Form, Button, Input } from "antd";
import { useCreateOrganization } from "../hooks";
import { CreateOrganizationInput, Organization } from "@dewo/app/graphql/types";

interface OrganizationCreateFormProps {
  onCreated(organization: Organization): unknown;
}

export const OrganizationCreateForm: FC<OrganizationCreateFormProps> = ({
  onCreated,
}) => {
  const createOrganization = useCreateOrganization();

  const [loading, setLoading] = useState(false);
  const handleSubmit = useCallback(
    async (values: CreateOrganizationInput) => {
      try {
        setLoading(true);
        const organization = await createOrganization(values);
        await onCreated(organization);
      } finally {
        setLoading(false);
      }
    },
    [createOrganization, onCreated]
  );

  return (
    <Form layout="vertical" requiredMark={false} onFinish={handleSubmit}>
      <Form.Item
        label="Organization Name"
        name="name"
        rules={[{ required: true, message: "Please enter a name" }]}
      >
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
