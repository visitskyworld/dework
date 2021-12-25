import React, { FC, useCallback, useMemo, useState } from "react";
import _ from "lodash";
import { Tag, Form, Select, ConfigProvider, Empty } from "antd";
import { useCreateTaskTag, useGenerateRandomTaskTagColor } from "./hooks";
import { useProjectTaskTags } from "../project/hooks";

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
  const tagById = useMemo(() => _.keyBy(tags, "id"), [tags]);

  const [loading, setLoading] = useState(false);
  const createTaskTag = useCreateTaskTag();
  const generateRandomTaskTagColor = useGenerateRandomTaskTagColor(tags);

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
      mode="tags"
      value={value}
      disabled={disabled}
      loading={loading}
      optionFilterProp="label"
      optionLabelProp="label" // don't put children inside tagRender
      placeholder={disabled ? "Select tags..." : "No tags..."}
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
        <Select.Option key={tag.id} value={tag.id} label={tag.label}>
          <Tag color={tag.color}>{tag.label}</Tag>
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
