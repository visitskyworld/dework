import { Button, Dropdown, Menu } from "antd";
import React, { FC } from "react";
import * as Icons from "@ant-design/icons";
import { TaskSection } from "@dewo/app/graphql/types";
import { useDeleteTaskSection } from "../../project/hooks";
import { useRunningCallback, useToggle } from "@dewo/app/util/hooks";
import { ReorderTaskSectionsModal } from "./ReorderTaskSectionsModal";

interface Props {
  section: TaskSection;
  projectId?: string;
}

export const TaskSectionOptionButton: FC<Props> = ({ section, projectId }) => {
  const deleteSection = useDeleteTaskSection();
  const [handleDelete, isDeleting] = useRunningCallback(
    () =>
      deleteSection({
        id: section.id,
        projectId: section.projectId,
        deletedAt: new Date().toISOString(),
      }),
    [deleteSection, section]
  );

  const managingSections = useToggle();

  return (
    <>
      <Dropdown
        trigger={["click"]}
        placement="bottomLeft"
        overlay={
          <Menu>
            {!!projectId && (
              <Menu.Item
                icon={<Icons.EditOutlined />}
                onClick={managingSections.toggleOn}
              >
                Rename
              </Menu.Item>
            )}
            {!!projectId && (
              <Menu.Item
                icon={<Icons.OrderedListOutlined />}
                onClick={managingSections.toggleOn}
              >
                Reorder
              </Menu.Item>
            )}
            <Menu.Item
              danger
              icon={<Icons.DeleteOutlined />}
              onClick={handleDelete}
            >
              Remove this section
            </Menu.Item>
          </Menu>
        }
      >
        <Button
          size="small"
          type="text"
          icon={<Icons.EditOutlined />}
          loading={isDeleting}
          className="dewo-task-board-column-section-options"
        />
      </Dropdown>
      {!!projectId && (
        <ReorderTaskSectionsModal
          visible={managingSections.isOn}
          projectId={projectId}
          status={section.status}
          onClose={managingSections.toggleOff}
        />
      )}
    </>
  );
};
