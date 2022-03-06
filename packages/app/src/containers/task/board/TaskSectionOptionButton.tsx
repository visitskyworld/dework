import { Button, Dropdown, Menu } from "antd";
import React, { FC } from "react";
import * as Icons from "@ant-design/icons";
import { Can } from "@dewo/app/contexts/PermissionsContext";
import { TaskSection } from "@dewo/app/graphql/types";
import { useUpdateTaskSection } from "../../project/hooks";
import { useRunningCallback } from "@dewo/app/util/hooks";

interface Props {
  section: TaskSection;
}

export const TaskSectionOptionButton: FC<Props> = ({ section }) => {
  const updateSection = useUpdateTaskSection();
  const [handleDelete, isDeleting] = useRunningCallback(
    () =>
      updateSection({
        id: section.id,
        projectId: section.projectId,
        deletedAt: new Date().toISOString(),
      }),
    [updateSection, section]
  );
  return (
    <Can I="update" a="TaskSection">
      <Dropdown
        trigger={["click"]}
        placement="bottomLeft"
        overlay={
          <Menu>
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
          icon={<Icons.MoreOutlined />}
          loading={isDeleting}
          className="dewo-task-board-column-section-options"
        />
      </Dropdown>
    </Can>
  );
};
