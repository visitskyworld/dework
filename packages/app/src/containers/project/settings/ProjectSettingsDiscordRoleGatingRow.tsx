import { FormSection } from "@dewo/app/components/FormSection";
import { ProjectRole } from "@dewo/app/graphql/types";
import { Form, Col, Row, Select, Button } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { FC, useCallback, useMemo, useState } from "react";
import { useDiscordGuildRoles } from "../../integrations/hooks";
import { projectRoleToString } from "./ProjectSettingsMemberList";

interface FormValues {
  discordRoleIds?: string[];
  projectRole: ProjectRole;
}

interface Props {
  organizationId: string;
}

export const ProjectSettingsDiscordRoleGatingRow: FC<Props> = ({
  organizationId,
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

  return (
    <Form<FormValues>
      form={form}
      layout="vertical"
      style={{ overflow: "hidden" }}
      initialValues={{ projectRole: ProjectRole.CONTRIBUTOR }}
      onValuesChange={handleChange}
    >
      <Row gutter={8}>
        <Col span={10}>
          <Form.Item name="discordRoleIds" label="Discord Roles">
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
              disabled={!values.discordRoleIds?.length}
            >
              Save
            </Button>
          </FormSection>
        </Col>
      </Row>
    </Form>
  );
};
