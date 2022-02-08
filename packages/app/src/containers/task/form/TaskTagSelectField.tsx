import React, { FC, useCallback, useMemo, useState } from "react";
import _ from "lodash";
import * as Icons from "@ant-design/icons";
import { Tag, Form, Select, ConfigProvider, Empty, Button } from "antd";
import { useCreateTaskTag, useGenerateRandomTagColor } from "../hooks";
import { useProjectTaskTags } from "../../project/hooks";
import { Can, usePermission } from "@dewo/app/contexts/PermissionsContext";
import { TaskTagDetailsModal } from "./TaskTagDetailsModal";
import { stopPropagation } from "@dewo/app/util/eatClick";

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

  const selectedTagIds = useMemo(
    () => value?.filter((tagId) => tagById[tagId]) ?? [],
    [value, tagById]
  );

  const [editingTagId, setEditingTagId] = useState<string>();
  const editingTag = useMemo(
    () => (!!editingTagId ? tagById[editingTagId] : undefined),
    [editingTagId, tagById]
  );

  const [loading, setLoading] = useState(false);
  const createTag = useCreateTaskTag();
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
          createTag({
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
      createTag,
      tagById,
      loading,
      generateRandomTaskTagColor,
      projectId,
      onChange,
    ]
  );

  return (
    <>
      <Select
        mode={canCreateTag ? "tags" : "multiple"}
        value={selectedTagIds}
        disabled={disabled}
        loading={loading}
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
            <Can I="update" a="TaskTag">
              <Button
                type="text"
                icon={<Icons.MoreOutlined />}
                className="dewo-tag-select-option-button"
                onClick={(e) => {
                  setEditingTagId(tag.id);
                  stopPropagation(e);
                }}
              />
            </Can>
          </Select.Option>
        ))}
      </Select>
      <TaskTagDetailsModal
        tag={editingTag}
        onClose={() => setEditingTagId(undefined)}
      />
    </>
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
