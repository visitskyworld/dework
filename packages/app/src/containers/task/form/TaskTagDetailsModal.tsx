import React, { FC, useCallback, useState } from "react";
import * as Icons from "@ant-design/icons";
import * as Colors from "@ant-design/colors";
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
import { useRunningCallback } from "@dewo/app/util/hooks";
import { stopPropagation } from "@dewo/app/util/eatClick";

interface Props {
  tag: TaskTag | undefined;
  onClose(): void;
}

interface ColorButtonProps {
  color: string;
  selected: boolean;
  onClick(): void;
}

const TaskTagColorButton: FC<ColorButtonProps> = ({
  color,
  selected,
  onClick,
}) => (
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
      onClick={onClick}
    >
      <Tag
        color={color}
        style={{ width: 20, height: 20, padding: 2, margin: 0 }}
        icon={selected && <Icons.CheckOutlined style={{ display: "block" }} />}
      />
    </Button>
  </Col>
);

interface ContentProps {
  tag: TaskTag;
  onClose(): void;
}

const TaskTagDetailsContent: FC<ContentProps> = ({ tag, onClose }) => {
  const [label, setLabel] = useState(tag.label);

  const showConfirmationModal = useCallback(() => {
    message.success("Tag updated");
  }, []);

  const updateTag = useUpdateTaskTag();
  const [updateName, updatingName] = useRunningCallback(
    () =>
      updateTag({ id: tag.id, projectId: tag.projectId, label })
        .then(showConfirmationModal)
        .then(onClose),
    [label, tag, updateTag]
  );
  const [deleteTag, deletingTag] = useRunningCallback(
    () =>
      updateTag({
        id: tag.id,
        projectId: tag.projectId,
        deletedAt: new Date().toISOString(),
      }).then(onClose),
    [tag, updateTag, onClose]
  );

  return (
    <>
      <Input.Group compact style={{ display: "flex", padding: 8 }}>
        <Input
          size="small"
          value={label}
          autoFocus
          onChange={(e) => setLabel(e.target.value)}
          onPressEnter={updateName}
        />
        <Button
          type="primary"
          loading={updatingName}
          icon={<Icons.CheckOutlined />}
          style={{ height: "unset" }}
          onClick={updateName}
        />
      </Input.Group>

      <Popconfirm
        title={
          <Typography.Text>
            Are you sure you want to remove this tag?{" "}
            <Tag color={tag.color}>{tag.label}</Tag>
          </Typography.Text>
        }
        icon={<Icons.DeleteOutlined style={{ color: Colors.grey.primary }} />}
        okType="danger"
        okText="Delete"
        onConfirm={deleteTag}
      >
        <Button
          type="text"
          block
          icon={<Icons.DeleteOutlined />}
          loading={deletingTag}
          style={{ textAlign: "left", paddingLeft: 10 }}
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
          <TaskTagColorButton
            color={color}
            selected={color === tag.color}
            onClick={() =>
              updateTag({ id: tag.id, projectId: tag.projectId, color })
            }
          />
        ))}
      </Row>
    </>
  );
};

export const TaskTagDetailsModal: FC<Props> = ({ tag, onClose }) => (
  <div onClick={stopPropagation} onKeyDown={stopPropagation}>
    <Modal
      destroyOnClose
      visible={!!tag}
      footer={null}
      width={172}
      bodyStyle={{ padding: 0 }}
      closable={false}
      onCancel={onClose}
    >
      {!!tag && <TaskTagDetailsContent tag={tag} onClose={onClose} />}
    </Modal>
  </div>
);
