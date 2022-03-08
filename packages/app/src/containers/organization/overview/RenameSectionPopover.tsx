import { ProjectSection } from "@dewo/app/graphql/types";
import { useRunning } from "@dewo/app/util/hooks";
import { Button, Input, Popover, Row, Space } from "antd";
import React, { FC, useCallback, useState } from "react";
import { useUpdateProjectSection } from "../hooks";

export const RenameSectionPopover: FC<{
  visible: boolean;
  onClose: () => void;
  organizationId: string;
  section: ProjectSection;
}> = ({ visible, onClose, section, organizationId }) => {
  const [newSectionName, setNewSectionName] = useState(section.name);
  const updateSection = useUpdateProjectSection();

  const [handleUpdate, updating] = useRunning(
    useCallback(async () => {
      await updateSection({
        id: section.id,
        organizationId,
        name: newSectionName,
      });
      onClose();
    }, [newSectionName, onClose, organizationId, section.id, updateSection])
  );

  return (
    <Popover
      visible={visible}
      trigger="click"
      onVisibleChange={onClose}
      content={
        <Space direction="vertical" style={{ padding: 8 }}>
          <Input
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            autoFocus
            placeholder="Change section name"
            onPressEnter={handleUpdate}
          />
          <Row style={{ gap: 8 }}>
            <Button
              loading={updating}
              disabled={updating}
              type="primary"
              size="small"
              style={{ flex: 1 }}
              onClick={handleUpdate}
            >
              Update
            </Button>
          </Row>
        </Space>
      }
    ></Popover>
  );
};
