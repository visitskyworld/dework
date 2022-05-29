import React, {
  CSSProperties,
  FC,
  useCallback,
  useMemo,
  useState,
} from "react";
import _ from "lodash";
import * as Icons from "@ant-design/icons";
import { Tag, Form, Select, ConfigProvider, Empty, Button } from "antd";
import { useCreateTaskTag, useGenerateRandomTagColor } from "../hooks";
import { Can } from "@dewo/app/contexts/PermissionsContext";
import { TaskTagDetailsModal } from "./TaskTagDetailsModal";
import { stopPropagation } from "@dewo/app/util/eatClick";
import { TaskTag } from "@dewo/app/graphql/types";
import { suggestedTags } from "../../../util/tags";
import { NamePath } from "antd/lib/form/interface";
import { Rule } from "antd/lib/form";

interface Props {
  name: NamePath;
  label?: string;
  disabled?: boolean;
  projectId?: string;
  allowCreate?: boolean;
  tags?: TaskTag[];
  style?: CSSProperties;
  rules?: Rule[];
  allowClear?: boolean;
  onClear?(): void;
}

interface ComponentProps {
  disabled?: boolean;
  allowCreate?: boolean;
  projectId?: string;
  tags?: TaskTag[];
  value?: string[];
  allowClear?: boolean;
  onClear?(): void;
  onChange?(value: string[]): void;
}

const suggestedTagMap = _.keyBy(suggestedTags, "label");

const TaskTagSelectFieldComponent: FC<ComponentProps> = ({
  tags,
  projectId,
  allowCreate,
  disabled,
  value,
  allowClear,
  onChange,
  onClear,
}) => {
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
        const tagPs = newTagLabels.map((label) =>
          createTag({
            label,
            projectId: projectId!,
            color:
              suggestedTagMap[label]?.color ?? generateRandomTaskTagColor(),
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

  const displayedSuggestions = useMemo(
    () =>
      suggestedTags.filter((tag) => !tags?.some((t) => t.label === tag.label)),
    [tags]
  );

  return (
    <>
      <Select
        mode={allowCreate && !!projectId ? "tags" : "multiple"}
        value={selectedTagIds}
        disabled={disabled}
        loading={loading}
        optionFilterProp="label"
        optionLabelProp="label" // don't put children inside tagRender
        placeholder={disabled ? "No tags..." : "Select tags..."}
        allowClear={allowClear}
        onClear={onClear}
        onChange={handleChange}
        tagRender={(props) => (
          <Tag
            {...props}
            color={tagById[props.value as string]?.color}
            children={props.label}
          />
        )}
      >
        {tags?.map((tag) => (
          <Select.Option
            key={tag.id}
            value={tag.id}
            label={tag.label}
            style={{ fontWeight: "unset" }}
            className="dewo-tag-select-option"
          >
            <Tag color={tag.color}>{tag.label}</Tag>
            <Can I="update" this={tag}>
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
        {allowCreate && !!displayedSuggestions.length && (
          <>
            <Select.OptGroup label="Suggested tags" />
            {displayedSuggestions.map((tag) => (
              <Select.Option
                key={tag.label}
                label={tag.label}
                style={{ fontWeight: "unset" }}
                className="dewo-tag-select-option"
              >
                <Tag color={tag.color}>{tag.label}</Tag>
              </Select.Option>
            ))}
          </>
        )}
      </Select>
      <TaskTagDetailsModal
        tag={editingTag}
        onClose={() => setEditingTagId(undefined)}
      />
    </>
  );
};

export const TaskTagSelectField: FC<Props> = ({
  name,
  disabled,
  allowCreate,
  projectId,
  tags,
  label,
  style,
  rules,
  allowClear,
  onClear,
}) => (
  <ConfigProvider
    renderEmpty={() => (
      <Empty description="Create your first tag by typing..." />
    )}
  >
    <Form.Item name={name} label={label} rules={rules} style={style}>
      <TaskTagSelectFieldComponent
        disabled={disabled}
        allowCreate={allowCreate}
        projectId={projectId}
        tags={tags}
        allowClear={allowClear}
        onClear={onClear}
      />
    </Form.Item>
  </ConfigProvider>
);
