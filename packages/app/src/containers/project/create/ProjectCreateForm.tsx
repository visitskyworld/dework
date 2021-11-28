import React, { FC, useCallback, useState } from "react";
import { Form, Button, Input } from "antd";
import { useCreateProject } from "../hooks";
import { CreateProjectInput, Project } from "@dewo/app/graphql/types";

interface ProjectCreateFormProps {
  organizationId: string;
  onCreated(project: Project): unknown;
}

export const ProjectCreateForm: FC<ProjectCreateFormProps> = ({
  organizationId,
  onCreated,
}) => {
  const createProject = useCreateProject();

  const [loading, setLoading] = useState(false);
  const handleSubmit = useCallback(
    async (values: CreateProjectInput) => {
      try {
        setLoading(true);
        const project = await createProject(values);
        await onCreated(project);
      } finally {
        setLoading(false);
      }
    },
    [createProject, onCreated]
  );

  return (
    <Form initialValues={{ organizationId }} onFinish={handleSubmit}>
      <Form.Item
        label="Project Name"
        name="name"
        rules={[{ required: true, message: "Please enter a name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="organizationId" hidden rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={loading}
        >
          Create
        </Button>
      </Form.Item>
    </Form>
  );
};
