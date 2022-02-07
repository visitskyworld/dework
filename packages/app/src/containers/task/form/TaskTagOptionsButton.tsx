import React, { FC, useCallback, useState } from "react";
import * as Icons from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Tag,
  Typography,
} from "antd";
import { useUpdateTaskTag } from "../hooks";
import { TaskTag } from "@dewo/app/graphql/types";
import { useRunningCallback, useToggle } from "@dewo/app/util/hooks";
import { stopPropagation } from "@dewo/app/util/eatClick";

interface Props {
  tag: TaskTag;
}

export const TaskTagOptionsButton: FC<Props> = ({ tag }) => {
  const [label, setLabel] = useState(tag.label);
  const modalVisible = useToggle();

  const showConfirmationModal = useCallback(() => {
    message.success("Tag updated");
  }, []);

  const updateTag = useUpdateTaskTag();
  const [updateName, updatingName] = useRunningCallback(
    () =>
      updateTag({ id: tag.id, projectId: tag.projectId, label })
        .then(showConfirmationModal)
        .then(modalVisible.toggleOff),
    [label, tag, updateTag]
  );
  const [deleteTag, deletingTag] = useRunningCallback(
    () =>
      updateTag({
        id: tag.id,
        projectId: tag.projectId,
        deletedAt: new Date(),
      }).then(modalVisible.toggleOff),
    [tag, updateTag, modalVisible.toggleOff]
  );

  return (
    <>
      <div onClick={stopPropagation} onKeyDown={stopPropagation}>
        <Button
          type="text"
          icon={<Icons.MoreOutlined />}
          className="dewo-tag-select-option-button"
          onClick={modalVisible.toggleOn}
        />
        <Modal
          destroyOnClose
          visible={modalVisible.isOn}
          footer={null}
          wrapClassName="z-index-2000"
          width={172}
          bodyStyle={{ padding: 0 }}
          maskStyle={{ zIndex: 2000 }}
          closable={false}
          onCancel={modalVisible.toggleOff}
        >
          <Row style={{ padding: 8 }}>
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
            <Button
              type="text"
              block
              icon={<Icons.DeleteOutlined />}
              loading={deletingTag}
              style={{ textAlign: "left", paddingLeft: 10 }}
              onClick={deleteTag}
            >
              Delete
            </Button>
          </Popconfirm>
          <Divider style={{ opacity: 0.3, marginTop: 2, marginBottom: 8 }} />
          <Typography.Paragraph
            type="secondary"
            className="ant-typography-caption font-bold"
            style={{ paddingLeft: 12, marginBottom: 0 }}
          >
            COLORS
          </Typography.Paragraph>

          <Row style={{ width: "100%", padding: 8, paddingTop: 0 }}>
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
                  onClick={() =>
                    updateTag({ id: tag.id, projectId: tag.projectId, color })
                  }
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
                    }
                  />
                </Button>
              </Col>
            ))}
          </Row>
        </Modal>
      </div>
    </>
  );
};
