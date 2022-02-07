import React, { FC, useState } from "react";
import * as Icons from "@ant-design/icons";
import {
  Tag,
  Button,
  Dropdown,
  Menu,
  Input,
  Row,
  Popconfirm,
  Typography,
  Col,
} from "antd";
import { useUpdateTaskTag } from "../hooks";
import { eatClick } from "@dewo/app/util/eatClick";
import { TaskTag } from "@dewo/app/graphql/types";
import { useRunningCallback } from "@dewo/app/util/hooks";

interface Props {
  tag: TaskTag;
}

export const TaskTagOptionsButton: FC<Props> = ({ tag }) => {
  const [loading, setLoading] = useState(false);
  const [label, setLabel] = useState(tag.label);
  const updateTag = useUpdateTaskTag();
  const [updateName, updatingName] = useRunningCallback(
    () => updateTag({ id: tag.id, projectId: tag.projectId, label }),
    [label, tag, updateTag]
  );

  return (
    <div
      style={{ backgroundColor: "red" }}
      {...[
        "onClick",
        "onMouseDown",
        "onMouseDownCapture",
        "onMouseEnter",
        "onMouseLeave",
        "onMouseMove",
        "onMouseMoveCapture",
        "onMouseOut",
        "onMouseOutCapture",
        "onMouseOver",
        "onMouseOverCapture",
        "onMouseUp",
        "onMouseUpCapture",
        "onKeyDown",
        "onKeyDownCapture",
        "onKeyPress",
        "onKeyPressCapture",
        "onKeyUp",
        "onKeyUpCapture",
      ].reduce((acc, key) => ({ ...acc, [key]: eatClick }), {})}
    >
      <Dropdown
        trigger={["click"]}
        placement="bottomRight"
        // placement="bottomLeft"
        overlay={
          <Menu style={{ width: 172 }}>
            <Row style={{ margin: 8 }}>
              <Input
                size="small"
                value={label}
                autoFocus
                suffix={updatingName && <Icons.LoadingOutlined />}
                onChange={(e) => setLabel(e.target.value)}
                onPressEnter={updateName}
              />
            </Row>
            <Popconfirm
              title={
                <Typography.Text>
                  Are you sure you want to remove this tag?{" "}
                  <Tag color={tag.color}>{tag.label}</Tag>
                </Typography.Text>
              }
              okType="danger"
              okText="Delete"
            >
              <Menu.Item icon={<Icons.DeleteOutlined />}>Delete</Menu.Item>
            </Popconfirm>
            <Menu.Divider style={{ opacity: 0.3 }} />
            <Typography.Text
              type="secondary"
              className="ant-typography-caption font-bold"
              style={{ paddingLeft: 12 }}
            >
              COLORS
            </Typography.Text>

            <Row style={{ width: "100%", paddingLeft: 8, paddingRight: 8 }}>
              {[
                "magenta",
                "red",
                "volcano",
                "orange",
                "gold",
                "yellow",
                "lime",
                "green",
                "cyan",
                "blue",
                "geekblue",
                "purple",
              ].map((color) => (
                <Col key={color}>
                  <Button
                    type="text"
                    style={{
                      width: 26,
                      height: 26,
                      padding: 0,
                      display: "grid",
                      placeItems: "center",
                    }}
                    onClick={(e) => {
                      eatClick(e);
                      updateTag({
                        id: tag.id,
                        projectId: tag.projectId,
                        color,
                      });
                    }}
                  >
                    <Tag
                      color={color}
                      style={{
                        width: 20,
                        height: 20,
                        padding: 2,
                        margin: 0,
                      }}
                      icon={
                        color === tag.color && (
                          <Icons.CheckOutlined style={{ display: "block" }} />
                        )
                        // <Icons.LoadingOutlined style={{ display: "block" }} />
                      }
                    />
                  </Button>
                </Col>
              ))}
            </Row>
          </Menu>
        }
      >
        <Button
          type="text"
          icon={<Icons.MoreOutlined />}
          className="dewo-tag-select-option-button"
        />
      </Dropdown>
    </div>
  );
};
