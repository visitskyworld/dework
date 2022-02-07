import React, { FC, useCallback, useMemo, useState } from "react";
import _ from "lodash";
import * as Icons from "@ant-design/icons";
import {
  Tag,
  Form,
  Select,
  ConfigProvider,
  Empty,
  Button,
  Dropdown,
  Menu,
  Input,
  Row,
  Popconfirm,
  Typography,
  Col,
} from "antd";
import { useCreateTaskTag, useGenerateRandomTagColor } from "../hooks";
import { useProjectTaskTags } from "../../project/hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { eatClick } from "@dewo/app/util/eatClick";

interface Props {
  disabled: boolean;
  projectId: string;
}

interface ComponentProps {
  disabled: boolean;
  projectId: string;
  value?: string[];
  onChange?(value: string[]): void;
}

const TaskTagSelectFieldComponent: FC<ComponentProps> = ({
  projectId,
  disabled,
  value,
  onChange,
}) => {
  const tags = useProjectTaskTags(projectId);
  const canCreateTag = usePermission("create", "TaskTag");
  const tagById = useMemo(() => _.keyBy(tags, "id"), [tags]);

  const [loading, setLoading] = useState(false);
  const createTaskTag = useCreateTaskTag();
  const generateRandomTaskTagColor = useGenerateRandomTagColor(tags);

  const handleChange = useCallback(
    async (labels: string[]) => {
      const [existingTagIds, newTagLabels] = _.partition(
        labels,
        (existingIdOrNewLabel) => !!tagById[existingIdOrNewLabel]
      );

      if (loading && !!newTagLabels.length) {
        onChange?.(existingTagIds);
        return;
      }

      try {
        setLoading(true);
        onChange?.(labels);
        const tagPs = newTagLabels.map((label) =>
          createTaskTag({
            label,
            projectId,
            color: generateRandomTaskTagColor(),
          })
        );
        const tags = await Promise.all(tagPs);
        onChange?.([...existingTagIds, ...tags.map((t) => t.id)]);
      } finally {
        setLoading(false);
      }
    },
    [
      createTaskTag,
      tagById,
      loading,
      generateRandomTaskTagColor,
      projectId,
      onChange,
    ]
  );

  return (
    <Select
      mode={canCreateTag ? "tags" : "multiple"}
      value={value}
      disabled={disabled}
      loading={loading}
      open // remove when done
      optionFilterProp="label"
      optionLabelProp="label" // don't put children inside tagRender
      placeholder={disabled ? "No tags..." : "Select tags..."}
      onChange={handleChange}
      tagRender={(props) => (
        <Tag
          {...props}
          color={tagById[props.value as string]?.color}
          children={props.label}
        />
      )}
    >
      {tags.map((tag) => (
        <Select.Option
          key={tag.id}
          value={tag.id}
          label={tag.label}
          style={{ fontWeight: "unset" }}
          className="dewo-tag-select-option"
        >
          <Tag color={tag.color}>{tag.label}</Tag>
          <Dropdown
            trigger={["click"]}
            placement="bottomRight"
            overlay={
              <Menu>
                <Row style={{ margin: 8 }}>
                  <Input
                    size="small"
                    value={tag.label}
                    autoFocus
                    onPressEnter={() => alert("save..")}
                  />
                </Row>
                <Popconfirm
                  title="Are you sure you want to remove this tag?"
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

                <Row style={{ width: 180, paddingLeft: 8, paddingRight: 8 }}>
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
                          alert("change color: " + color);
                          eatClick(e);
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
                              <Icons.CheckOutlined
                                style={{ display: "block" }}
                              />
                            )
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
        </Select.Option>
      ))}
    </Select>
  );
};

export const TaskTagSelectField: FC<Props> = ({ disabled, projectId }) => (
  <ConfigProvider
    renderEmpty={() => (
      <Empty description="Create your first tag by typing..." />
    )}
  >
    <Form.Item name="tagIds" label="Tags" rules={[{ type: "array" }]}>
      <TaskTagSelectFieldComponent disabled={disabled} projectId={projectId} />
    </Form.Item>
  </ConfigProvider>
);
