import { Button, Divider, Popconfirm, Row } from "antd";
import React, { FC, useCallback } from "react";
import * as Icons from "@ant-design/icons";
import * as Colors from "@ant-design/colors";
import styles from "../TaskViewForm.module.less";
import { useCopyToClipboardAndShowToast } from "@dewo/app/util/hooks";
import { TaskView } from "@dewo/app/graphql/types";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";

interface Props {
  view: TaskView;
  dirty: boolean;
  submitting: boolean;
  showDelete: boolean;
  onReset(): void;
  onDelete(): void;
  saveText?: string;
}

export const TaskViewUpdateFormFooter: FC<Props> = ({
  view,
  dirty,
  submitting,
  showDelete,
  onReset,
  onDelete,
  saveText = "Save for everyone",
}) => {
  const copyToClipboard = useCopyToClipboardAndShowToast("View link copied");
  const handleCopy = useCallback(
    () => copyToClipboard(view.permalink),
    [copyToClipboard, view.permalink]
  );

  const canUpdate = usePermission("update", view);
  const canDelete = usePermission("delete", view);

  return (
    <>
      <Divider />

      <Button
        block
        type="text"
        icon={<Icons.LinkOutlined />}
        children="Copy link to view"
        style={{ textAlign: "left" }}
        className={styles.button}
        onClick={handleCopy}
      />
      {canDelete && showDelete && (
        <Popconfirm
          icon={<Icons.DeleteOutlined style={{ color: Colors.grey.primary }} />}
          title="Delete this view?"
          okType="danger"
          okText="Delete"
          onConfirm={onDelete}
        >
          <Button
            block
            type="text"
            icon={<Icons.DeleteOutlined />}
            children="Delete view"
            className={styles.button}
            style={{ textAlign: "left" }}
          />
        </Popconfirm>
      )}
      {dirty && (
        <Row style={{ marginTop: 8, gap: 8 }}>
          <Button block onClick={onReset} style={{ flex: 1 }}>
            Discard changes
          </Button>
          {canUpdate && (
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={submitting}
              style={{ flex: 1 }}
            >
              {saveText}
            </Button>
          )}
        </Row>
      )}
    </>
  );
};
