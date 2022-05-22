import { Button, Dropdown, Menu } from "antd";
import React, { FC, useCallback } from "react";
import * as Icons from "@ant-design/icons";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { useToggle } from "@dewo/app/util/hooks";
import { CreateWorkspaceModal } from "../../../workspace/CreateWorkspaceModal";
import { Workspace } from "@dewo/app/graphql/types";
import { useOrganizationDetails } from "../../hooks";
import { useRouter } from "next/router";
import { RenameWorkspacePopover } from "../../../workspace/RenameWorkspacePopover";
import { useUpdateWorkspace } from "@dewo/app/containers/workspace/hooks";

interface Props {
  workspace: Workspace;
  isDefault: boolean;
  organizationId: string;
}

export const WorkspaceOptionsButton: FC<Props> = ({
  workspace,
  isDefault,
  organizationId,
}) => {
  const { organization } = useOrganizationDetails(organizationId);
  const canCreateProject = usePermission("create", {
    __typename: "Project",
    organizationId,
  });
  const canCreate = usePermission("create", "Workspace");
  const canUpdate = usePermission("update", "Workspace");

  const createModal = useToggle();

  const router = useRouter();
  const updateSection = useUpdateWorkspace();
  const handleDeleteSection = useCallback(async () => {
    await updateSection({
      id: workspace.id,
      organizationId,
      deletedAt: new Date().toISOString(),
    });
  }, [updateSection, workspace.id, organizationId]);

  const renameWorkspace = useToggle();

  if (!canCreate && !canUpdate) return null;
  return (
    <>
      <Dropdown
        trigger={["click"]}
        placement="bottomLeft"
        overlay={
          <Menu>
            {canCreate && (
              <Menu.Item
                icon={<Icons.PlusOutlined />}
                onClick={createModal.toggleOn}
              >
                Create workspace
              </Menu.Item>
            )}
            {canCreateProject && (
              <Menu.Item
                icon={<Icons.PlusOutlined />}
                onClick={() =>
                  router.push(
                    `${organization?.permalink}/create${
                      isDefault ? "" : `?workspaceId=${workspace.id}`
                    }`
                  )
                }
              >
                Create project in workspace
              </Menu.Item>
            )}
            {canUpdate && !isDefault && (
              <Menu.Item
                icon={<Icons.EditOutlined />}
                onClick={renameWorkspace.toggleOn}
              >
                Rename this workspace
              </Menu.Item>
            )}
            {canUpdate && !isDefault && (
              <Menu.Item
                danger
                icon={<Icons.DeleteOutlined />}
                onClick={handleDeleteSection}
              >
                Remove this workspace
              </Menu.Item>
            )}
          </Menu>
        }
      >
        <Button type="text" icon={<Icons.MoreOutlined />} />
      </Dropdown>

      <RenameWorkspacePopover
        visible={renameWorkspace.isOn}
        onClose={renameWorkspace.toggleOff}
        organizationId={organizationId}
        workspace={workspace}
      />

      <CreateWorkspaceModal
        organizationId={organizationId}
        visible={createModal.isOn}
        onClose={createModal.toggleOff}
      />
    </>
  );
};
