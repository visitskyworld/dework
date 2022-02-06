import { Button, Dropdown, Menu } from "antd";
import React, { FC, useCallback } from "react";
import * as Icons from "@ant-design/icons";
import { useOrganization } from "../../hooks";
import { useRouter } from "next/router";
import { NotionIcon } from "@dewo/app/components/icons/Notion";
import { TrelloIcon } from "@dewo/app/components/icons/Trello";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { useToggle } from "@dewo/app/util/hooks";
import { CreateSectionModal } from "../CreateSectionModal";

interface Props {
  organizationId: string;
}

export const ProjectSectionPlusButton: FC<Props> = ({ organizationId }) => {
  const { organization } = useOrganization(organizationId);
  const router = useRouter();
  const navigateToProjectCreate = useCallback(
    () => router.push(`${organization?.permalink}/create`),
    [router, organization?.permalink]
  );

  const canCreateProject = usePermission("create", "Project");
  const canCreateProjectSection = usePermission("create", "ProjectSection");

  const createSectionModal = useToggle();

  if (!canCreateProject && !canCreateProjectSection) return null;
  return (
    <>
      <Dropdown
        trigger={["click"]}
        placement="bottomLeft"
        overlay={
          <Menu>
            {canCreateProject && (
              <>
                <Menu.Item onClick={navigateToProjectCreate}>
                  Create a project
                </Menu.Item>
                <Menu.SubMenu title="Import from Notion/Trello">
                  <Menu.Item icon={<NotionIcon />}>
                    Import from Notion
                  </Menu.Item>
                  <Menu.Item icon={<TrelloIcon />}>
                    Import from Trello
                  </Menu.Item>
                </Menu.SubMenu>
              </>
            )}
            {canCreateProjectSection && (
              <Menu.Item onClick={createSectionModal.toggleOn}>
                Create a section
              </Menu.Item>
            )}
          </Menu>
        }
      >
        <Button
          type="text"
          icon={<Icons.PlusOutlined />}
          className="text-secondary"
        />
      </Dropdown>
      <CreateSectionModal
        organizationId={organizationId}
        visible={createSectionModal.isOn}
        onClose={createSectionModal.toggleOff}
      />
    </>
  );
};
