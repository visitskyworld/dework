import { FormSection } from "@dewo/app/components/FormSection";
import { ProjectDetails, ProjectRole } from "@dewo/app/graphql/types";
import { Form, Col, Divider, Row, Typography, Select, Button } from "antd";
import React, { FC } from "react";
import { useOrganizationDiscordIntegration } from "../../integrations/hooks";
import { projectRoleToString } from "./ProjectSettingsMemberList";

interface Props {
  project: ProjectDetails;
}

export const ProjectSettingsDiscordRoleGating: FC<Props> = ({ project }) => {
  const orgInt = useOrganizationDiscordIntegration(project.organizationId);

  const discordRoles = ["Role 1", "Role 2", "Role 3"];
  const projectRoles = [ProjectRole.CONTRIBUTOR, ProjectRole.ADMIN];

  return (
    <>
      <Divider />
      <Typography.Title level={4} style={{ marginBottom: 4 }}>
        Discord Role Gating
      </Typography.Title>
      <Typography.Paragraph type="secondary">
        Allow your community join this project as project contributor or
        steward, depending on their Discord role.
      </Typography.Paragraph>
      {!orgInt && (
        <Typography.Paragraph type="secondary">
          First, connect with Discord. (TODO connect flow...)
        </Typography.Paragraph>
      )}

      <Form
        layout="vertical"
        style={{ overflow: "hidden" }}
        initialValues={{ projectRole: ProjectRole.CONTRIBUTOR }}
      >
        <Row gutter={8}>
          <Col span={10}>
            <Form.Item name="discordRoles" label="Discord Roles">
              <Select
                mode="multiple"
                // style={{ width: "100%" }}
                placeholder="Select Discord Roles..."
                showSearch
                optionFilterProp="label"
                loading={!discordRoles}
              >
                {discordRoles.map((discordRole) => (
                  <Select.Option
                    key={discordRole}
                    value={discordRole}
                    label={discordRole}
                  >
                    {discordRole}
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
                disabled={false /* if no roles selected */}
              >
                Save
              </Button>
            </FormSection>
          </Col>
        </Row>
      </Form>
    </>
  );
  // const tokenGate = project.tokenGates[0];
  // const createProjectTokenGate = useCreateProjectTokenGate();
  // const deleteProjectTokenGate = useDeleteProjectTokenGate();
  // const updateProject = useUpdateProject();

  // const handleChangeTokenGating = useCallback(
  //   async (token: PaymentToken | undefined) => {
  //     if (!!token && !tokenGate) {
  //       await createProjectTokenGate({
  //         projectId: project.id,
  //         tokenId: token.id,
  //       });
  //       if (project.visibility !== ProjectVisibility.PRIVATE) {
  //         await updateProject({
  //           id: project.id,
  //           visibility: ProjectVisibility.PRIVATE,
  //         });
  //       }
  //     } else {
  //       await deleteProjectTokenGate({
  //         projectId: project.id,
  //         tokenId: tokenGate.token.id,
  //       });
  //     }
  //   },
  //   [
  //     tokenGate,
  //     createProjectTokenGate,
  //     project.id,
  //     project.visibility,
  //     updateProject,
  //     deleteProjectTokenGate,
  //   ]
  // );

  // return (
  //   <>
  //     <Typography.Title level={4} style={{ marginBottom: 4 }}>
  //       Token Gating
  //     </Typography.Title>

  //     <Divider style={{ marginTop: 0 }} />

  //     <ProjectSettingsTokenGatingInput
  //       value={tokenGate?.token ?? undefined}
  //       onChange={handleChangeTokenGating}
  //     />
  //   </>
  // );
};
