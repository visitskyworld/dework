import { FormSection } from "@dewo/app/components/FormSection";
import { ProjectRole } from "@dewo/app/graphql/types";
import { useRunningCallback } from "@dewo/app/util/hooks";
import { Form, Col, Row, Select, Button } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { FC, useCallback, useMemo, useState } from "react";
import {
  useCreateDiscordRoleGateProjectIntegration,
  useDiscordGuildRoles,
} from "../../../integrations/hooks";
import { projectRoleToString } from "../ProjectSettingsMemberList";

interface FormValues {
  discordRoleIds?: string[];
  projectRole: ProjectRole;
}

interface Props {
  projectId: string;
  organizationId: string;
  organizationIntegrationId: string;
}

export const CreateDiscordRoleGateForm: FC<Props> = ({
  projectId,
  organizationId,
  organizationIntegrationId,
}) => {
  const [form] = useForm<FormValues>();
  const discordRoles = useDiscordGuildRoles(organizationId);
  const projectRoles = useMemo(
    () => [ProjectRole.CONTRIBUTOR, ProjectRole.ADMIN],
    []
  );

  const [values, setValues] = useState<Partial<FormValues>>({});
  const handleChange = useCallback(
    (_changed: Partial<FormValues>, values: Partial<FormValues>) =>
      setValues(values),
    []
  );

  const createIntegration = useCreateDiscordRoleGateProjectIntegration();
  const [handleSubmit, submitting] = useRunningCallback(
    async (values: FormValues) => {
      await createIntegration({
        projectId,
        discordRoleIds: values.discordRoleIds!,
        projectRole: values.projectRole,
        organizationIntegrationId,
      });
    },
    [createIntegration, projectId, organizationIntegrationId]
  );

  return (
    <Form<FormValues>
      form={form}
      layout="vertical"
      style={{ overflow: "hidden", width: "100%" }}
      initialValues={{ projectRole: ProjectRole.CONTRIBUTOR }}
      requiredMark={false}
      onValuesChange={handleChange}
      onFinish={handleSubmit}
    >
      <Row gutter={8}>
        <Col span={10}>
          <Form.Item
            name="discordRoleIds"
            label="Discord Roles"
            rules={[{ required: true }]}
          >
            <Select
              mode="multiple"
              // style={{ width: "100%" }}
              placeholder="Select Discord Roles..."
              showSearch
              optionFilterProp="label"
              loading={!discordRoles}
            >
              {discordRoles?.map((discordRole) => (
                <Select.Option
                  key={discordRole.id}
                  value={discordRole.id}
                  label={discordRole.name}
                >
                  {discordRole.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={10}>
          <Form.Item name="projectRole" label="Can join this project as">
            <Select
              // style={{ width: "100%" }}
              placeholder="Select Discord Roles..."
              showSearch
              optionFilterProp="label"
            >
              {projectRoles.map((projectRole) => (
                <Select.Option
                  key={projectRole}
                  value={projectRole}
                  label={projectRoleToString[projectRole]}
                >
                  {projectRoleToString[projectRole]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={4}>
          <FormSection label={"\u2060"} style={{ width: "100%" }}>
            <Button
              htmlType="submit"
              type="primary"
              block
              loading={submitting}
              disabled={!values.discordRoleIds?.length}
            >
              Add
            </Button>
          </FormSection>
        </Col>
      </Row>
    </Form>
  );
};
