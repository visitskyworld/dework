import { FormSection } from "@dewo/app/components/FormSection";
import * as Icons from "@ant-design/icons";
import { TaskDetails } from "@dewo/app/graphql/types";
import { eatClick, stopPropagation } from "@dewo/app/util/eatClick";
import {
  Button,
  Col,
  Dropdown,
  Menu,
  message,
  Popconfirm,
  Row,
  Typography,
} from "antd";
import { useRouter } from "next/router";
import React, { FC, useCallback } from "react";
import { useDeleteTask } from "../hooks";
import CopyToClipboard from "react-copy-to-clipboard";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";

interface Props {
  task: TaskDetails;
}

export const TaskNumberAndSettings: FC<Props> = ({ task }) => {
  const canDelete = usePermission("delete", task);
  const deleteTask = useDeleteTask();
  const router = useRouter();

  const handleDeleteTask = useCallback(async () => {
    await deleteTask(task);
    await router.push(
      `/o/${router.query.organizationSlug}/p/${router.query.projectSlug}`
    );
  }, [deleteTask, task, router]);

  const copiedToClipboard = useCallback(
    () => message.success({ content: "Copied to clipboard" }),
    []
  );

  return (
    <FormSection label="Story ID">
      <Row style={{ justifyContent: "space-between" }} onBlur={stopPropagation}>
        <Col className="ant-input ant-input-sm" style={{ flex: 1 }}>
          <Typography.Text copyable type="secondary">
            {task.number}
          </Typography.Text>
        </Col>
        <Dropdown
          key="avatar"
          placement="bottomRight"
          trigger={["click"]}
          overlay={
            <Menu>
              <Menu.Item
                icon={<Icons.LinkOutlined />}
                children={
                  <CopyToClipboard
                    text={task.permalink}
                    onCopy={copiedToClipboard}
                  >
                    <Typography.Text>Copy task link</Typography.Text>
                  </CopyToClipboard>
                }
              />
              {canDelete && (
                <Popconfirm
                  icon={null}
                  title="Delete this task?"
                  okType="danger"
                  okText="Delete"
                  onConfirm={handleDeleteTask}
                >
                  <Menu.Item
                    icon={<Icons.DeleteOutlined />}
                    children="Delete"
                    onClick={(e) => eatClick(e.domEvent)}
                  />
                </Popconfirm>
              )}
            </Menu>
          }
        >
          <Button
            type="text"
            size="small"
            icon={<Icons.SettingOutlined />}
            style={{ marginLeft: 8 }}
          />
        </Dropdown>
      </Row>
    </FormSection>
  );
};
