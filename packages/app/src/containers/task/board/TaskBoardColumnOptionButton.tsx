import { useToggle } from "@dewo/app/util/hooks";
import { Button, Dropdown, Menu } from "antd";
import React, { FC } from "react";
import * as Icons from "@ant-design/icons";
import { CreateTaskSectionModal } from "../../organization/overview/CreateSectionModal";
import { TaskStatus } from "@dewo/app/graphql/types";

interface Props {
  projectId: string;
  status: TaskStatus;
}

export const TaskBoardColumnOptionButton: FC<Props> = ({
  projectId,
  status,
}) => {
  const createSectionModal = useToggle();
  return (
    <>
      <Dropdown
        trigger={["click"]}
        placement="bottomLeft"
        overlay={
          <Menu>
            <Menu.Item
              icon={<Icons.PlusOutlined />}
              onClick={createSectionModal.toggleOn}
            >
              Create section
            </Menu.Item>
          </Menu>
        }
      >
        <Button type="text" icon={<Icons.MoreOutlined />} />
      </Dropdown>
      <CreateTaskSectionModal
        projectId={projectId}
        status={status}
        visible={createSectionModal.isOn}
        onClose={createSectionModal.toggleOff}
      />
    </>
  );
};