import React, { FC, useMemo } from "react";
import _ from "lodash";
import { Tag, Select, Typography, Row } from "antd";
import { TaskTag } from "@dewo/app/graphql/types";
import { useOrganizationDetails } from "../../../organization/hooks";

interface Props {
  tags?: TaskTag[];
  organizationId?: string;
  value?: string[];
  onClear?(): void;
  onChange?(value: string[]): void;
}

export const TaskViewTagSelect: FC<Props> = ({
  tags,
  value,
  organizationId,
  onChange,
  onClear,
}) => {
  const tagById = useMemo(() => _.keyBy(tags, "id"), [tags]);
  const selectedTagIds = useMemo(
    () => value?.filter((tagId) => tagById[tagId]) ?? [],
    [value, tagById]
  );

  const { organization } = useOrganizationDetails(organizationId);
  const projectById = useMemo(
    () => _.keyBy(organization?.projects ?? [], "id"),
    [organization?.projects]
  );

  return (
    <>
      <Select
        mode="multiple"
        value={selectedTagIds}
        placeholder="Select tags..."
        optionFilterProp="label"
        optionLabelProp="label" // don't put children inside tagRender
        onClear={onClear}
        onChange={onChange}
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
          >
            <Row align="middle" justify="space-between">
              <Tag color={tag.color}>{tag.label}</Tag>
              <Typography.Text
                className="text-secondary ant-typography-caption"
                style={{ textTransform: "uppercase", marginRight: 8 }}
              >
                {projectById[tag.projectId]?.name}
              </Typography.Text>
            </Row>
          </Select.Option>
        ))}
      </Select>
    </>
  );
};
