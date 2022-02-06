import { Button, Dropdown, Menu } from "antd";
import React, { FC, useCallback } from "react";
import * as Icons from "@ant-design/icons";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { useToggle } from "@dewo/app/util/hooks";
import { CreateSectionModal } from "../CreateSectionModal";
import { ProjectSection } from "@dewo/app/graphql/types";
import { useOrganization, useUpdateProjectSection } from "../../hooks";
import { useRouter } from "next/router";

interface Props {
  section: ProjectSection;
  isDefault: boolean;
  organizationId: string;
}

export const ProjectSectionOptionsButton: FC<Props> = ({
  section,
  isDefault,
  organizationId,
}) => {
  const { organization } = useOrganization(organizationId);
  const canCreateProject = usePermission("create", "Project");
  const canCreate = usePermission("create", "ProjectSection");
  const canUpdate = usePermission("update", "ProjectSection");

  const createSectionModal = useToggle();

  const router = useRouter();
  const updateSection = useUpdateProjectSection();
  const handleDeleteSection = useCallback(async () => {
    await updateSection({
      id: section.id,
      deletedAt: new Date().toISOString(),
    });
  }, [updateSection, section.id]);

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
                onClick={createSectionModal.toggleOn}
              >
                Create section
              </Menu.Item>
            )}
            {canCreateProject && (
              <Menu.Item
                icon={<Icons.PlusOutlined />}
                onClick={() =>
                  router.push(
                    `${organization?.permalink}/create${
                      isDefault ? "" : `?sectionId=${section.id}`
                    }`
                  )
                }
              >
                Create project in section
              </Menu.Item>
            )}
            {canUpdate && !isDefault && (
              <Menu.Item
                danger
                icon={<Icons.DeleteOutlined />}
                onClick={handleDeleteSection}
              >
                Remove this section
              </Menu.Item>
            )}
          </Menu>
        }
      >
        <Button type="text" icon={<Icons.MoreOutlined />} />
      </Dropdown>
      <CreateSectionModal
        organizationId={organizationId}
        visible={createSectionModal.isOn}
        onClose={createSectionModal.toggleOff}
      />
    </>
  );
};
