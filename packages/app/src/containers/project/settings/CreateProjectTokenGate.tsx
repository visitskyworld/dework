import React, { FC, useCallback, useState } from "react";
import { Button, Dropdown, Menu, Tooltip, Typography } from "antd";
import * as Icons from "@ant-design/icons";
import { PaymentTokenForm } from "../../payment/token/PaymentTokenForm";
import {
  PaymentToken,
  ProjectDetails,
  ProjectRole,
} from "@dewo/app/graphql/types";
import { useCreateProjectTokenGate } from "../hooks";
import { projectRoleDescription, projectRoleToString } from "./strings";

interface Props {
  project: ProjectDetails;
}

export const CreateProjectTokenGate: FC<Props> = ({ project }) => {
  const createProjectTokenGate = useCreateProjectTokenGate();

  const [projectRole, setProjectRole] = useState<ProjectRole>();

  const handleCreate = useCallback(
    async (token: PaymentToken) => {
      await createProjectTokenGate({
        projectId: project.id,
        tokenId: token!.id,
        role: projectRole!,
      });
    },
    [projectRole, project, createProjectTokenGate]
  );

  return (
    <>
      <Typography.Paragraph type="secondary">
        Allow users with a certain ERC20, ERC721 or ERC1155 token to join this
        project without a manual invite
      </Typography.Paragraph>
      <PaymentTokenForm
        onDone={handleCreate}
        renderSubmitButton={({ onClick, ...buttonProps }) => (
          <Dropdown
            placement="bottomCenter"
            trigger={["click"]}
            overlay={
              <Menu style={{ textAlign: "center" }}>
                <Typography.Text type="secondary">
                  What project role should token holders get?
                </Typography.Text>
                {[ProjectRole.CONTRIBUTOR, ProjectRole.ADMIN].map(
                  (projectRole) => (
                    <Menu.Item
                      onClick={() => {
                        setProjectRole(projectRole);
                        onClick?.(undefined as any);
                      }}
                    >
                      {projectRoleToString[projectRole]}
                      <Tooltip
                        placement="right"
                        title={
                          <Typography.Text style={{ whiteSpace: "pre-line" }}>
                            {projectRoleDescription[projectRole]}
                          </Typography.Text>
                        }
                      >
                        <Icons.QuestionCircleOutlined
                          style={{ marginLeft: 8 }}
                        />
                      </Tooltip>
                    </Menu.Item>
                  )
                )}
              </Menu>
            }
          >
            <Button {...buttonProps}>Enable Token Gating</Button>
          </Dropdown>
        )}
      />
    </>
  );
};
