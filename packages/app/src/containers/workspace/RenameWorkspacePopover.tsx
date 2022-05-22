import { Workspace } from "@dewo/app/graphql/types";
import { useRunning } from "@dewo/app/util/hooks";
import { Button, Input, Popover, Row, Space } from "antd";
import React, { FC, useCallback, useState } from "react";
import { useUpdateWorkspace } from "./hooks";

export const RenameWorkspacePopover: FC<{
  visible: boolean;
  onClose: () => void;
  organizationId: string;
  workspace: Workspace;
}> = ({ visible, onClose, workspace, organizationId }) => {
  const [name, setName] = useState(workspace.name);
  const update = useUpdateWorkspace();

  const [handleUpdate, updating] = useRunning(
    useCallback(async () => {
      await update({
        name,
        organizationId,
        id: workspace.id,
      });
      onClose();
    }, [name, onClose, organizationId, workspace.id, update])
  );

  return (
    <Popover
      visible={visible}
      trigger="click"
      onVisibleChange={onClose}
      content={
        <Space direction="vertical" style={{ padding: 8 }}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            placeholder="Change workspace name"
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
