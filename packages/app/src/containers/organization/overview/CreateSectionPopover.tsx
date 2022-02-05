import { useRunningCallback } from "@dewo/app/util/hooks";
import { Button, Input, Popover } from "antd";
import React, { FC, useState } from "react";

export const CreateSectionPopover: FC = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");

  const [handleCreate, creating] = useRunningCallback(async () => {
    alert("handle create...");
  }, []);

  return (
    <Popover
      trigger="click"
      onVisibleChange={setVisible}
      content={
        // <Input autoFocus placeholder="Enter section name..." />
        <Input.Group key={String(visible)} compact style={{ display: "flex" }}>
          <Input
            autoFocus
            placeholder="Enter section name..."
            disabled={creating}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onPressEnter={handleCreate}
          />
          {!!name && (
            <Button loading={creating} type="primary" onClick={handleCreate}>
              Create
            </Button>
          )}
        </Input.Group>
      }
    >
      {children}
    </Popover>
  );
};
