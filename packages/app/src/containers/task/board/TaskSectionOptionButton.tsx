import { Button } from "antd";
import React, { FC } from "react";
import * as Icons from "@ant-design/icons";
import { TaskSection } from "@dewo/app/graphql/types";
import { useToggle } from "@dewo/app/util/hooks";
import { ReorderTaskSectionsModal } from "./ReorderTaskSectionsModal";

interface Props {
  section: TaskSection;
  projectId?: string;
}

export const TaskSectionOptionButton: FC<Props> = ({ section, projectId }) => {
  const managingSections = useToggle();
  return (
    <>
      <Button
        size="small"
        type="text"
        icon={<Icons.EditOutlined />}
        className="dewo-task-board-column-section-options"
        onClick={managingSections.toggleOn}
      />
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
