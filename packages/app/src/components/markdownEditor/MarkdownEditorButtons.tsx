import React, { FC, SyntheticEvent } from "react";
import { Button, Typography } from "antd";

interface Props {
  disabled?: boolean;
  onSave?(e?: SyntheticEvent): void;
  onCancel?(e?: SyntheticEvent): void;
}

export const MarkdownEditorButtons: FC<Props> = ({
  disabled,
  onSave,
  onCancel,
}) => (
  <>
    {!!onCancel && (
      <Button
        size="small"
        type="text"
        style={{ marginRight: 8 }}
        onClick={onCancel}
      >
        <Typography.Text type="secondary">Cancel</Typography.Text>
      </Button>
    )}
    {!!onSave && (
      <Button size="small" type="primary" disabled={disabled} onClick={onSave}>
        Save
      </Button>
    )}
  </>
);
