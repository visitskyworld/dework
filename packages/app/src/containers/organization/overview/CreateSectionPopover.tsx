import { useRunningCallback } from "@dewo/app/util/hooks";
import { Button, Input, Popover } from "antd";
import React, { FC, useState } from "react";
import { useCreateProjectSection } from "../hooks";

interface Props {
  organizationId: string;
}

export const CreateSectionPopover: FC<Props> = ({
  organizationId,
  children,
}) => {
  // const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");

  const createSection = useCreateProjectSection();
  const [handleCreate, creating] = useRunningCallback(async () => {
    await createSection({ name, organizationId });
    setName("");
  }, [name, organizationId, createSection]);

  return (
    <Popover
      trigger="click"
      // onVisibleChange={setVisible}
      content={
        // <Input autoFocus placeholder="Enter section name..." />
        <Input.Group compact style={{ display: "flex" }}>
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
