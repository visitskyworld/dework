import React, { FC, useCallback, useMemo, useState } from "react";
import _ from "lodash";
import { Tag, Form, Select, ConfigProvider, Empty } from "antd";
import { useCreateOrganizationTag, useAllOrganizationTags } from "../hooks";
import { useGenerateRandomTagColor } from "../../task/hooks";

interface OrganizationTagSelectFieldProps {
  organizationId: string;
}

interface OrganizationTagSelectFieldComponentProps
  extends OrganizationTagSelectFieldProps {
  value?: string[];
  onChange?(value: string[]): void;
}

const OrganizationTagSelectFieldComponent: FC<
  OrganizationTagSelectFieldComponentProps
> = ({ value, organizationId, onChange }) => {
  const tags = useAllOrganizationTags(organizationId);
  const tagById = useMemo(() => _.keyBy(tags, "id"), [tags]);

  const [loading, setLoading] = useState(false);
  const createOrganizationTag = useCreateOrganizationTag();
  const generateRandomTagColor = useGenerateRandomTagColor(tags);

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
          createOrganizationTag({
            label,
            organizationId,
            color: generateRandomTagColor(),
          })
        );
        const tags = await Promise.all(tagPs);
        onChange?.([...existingTagIds, ...tags.map((t) => t.id)]);
      } finally {
        setLoading(false);
      }
    },
    [
      loading,
      tagById,
      organizationId,
      onChange,
      createOrganizationTag,
      generateRandomTagColor,
    ]
  );

  return (
    <Select
      mode={"tags"}
      value={value}
      loading={loading}
      optionFilterProp="label"
      placeholder="Select tags..."
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

export const OrganizationTagSelectField: FC<
  OrganizationTagSelectFieldProps
> = ({ organizationId }) => (
  <ConfigProvider
    renderEmpty={() => (
      <Empty description="Create your first tag by typing..." />
    )}
  >
    <Form.Item name="tagIds" label="Tags" rules={[{ type: "array" }]}>
      <OrganizationTagSelectFieldComponent organizationId={organizationId} />
    </Form.Item>
  </ConfigProvider>
);
