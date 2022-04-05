import { TaskTag } from "@dewo/app/graphql/types";
import { Divider, Row, Tag, Typography } from "antd";
import _ from "lodash";
import React, { FC, useCallback, useMemo } from "react";

interface Props {
  tags: TaskTag[];
  value?: string[];
  onChange?(value: string[]): void;
}

export const TagCloudInput: FC<Props> = ({
  tags,
  value: selectedTagLabels,
  onChange,
}) => {
  const [selectedTags, unselectedTags] = useMemo(
    () => _.partition(tags, (t) => !!selectedTagLabels?.includes(t.label)),
    [selectedTagLabels, tags]
  );

  const selectTag = useCallback(
    (tagLabel: string) => onChange?.([...(selectedTagLabels || []), tagLabel]),
    [selectedTagLabels, onChange]
  );
  const unselectTag = useCallback(
    (tagLabel: string) =>
      onChange?.(
        (selectedTagLabels || []).filter((label) => label !== tagLabel)
      ),
    [selectedTagLabels, onChange]
  );

  return (
    <>
      {!!selectedTags.length && (
        <>
          <Row gutter={[8, 4]}>
            {selectedTags.map((tag) => (
              <Tag
                key={tag.id}
                color={tag.color}
                className="hover:cursor-pointer"
                closable
                onClose={() => unselectTag(tag.label)}
              >
                {tag.label}
              </Tag>
            ))}
          </Row>
          <Divider style={{ marginTop: 8, marginBottom: 8 }} />
        </>
      )}
      <Typography.Text type="secondary" className="ant-typography-caption">
        Click on tags to show tasks for
      </Typography.Text>
      <Row gutter={[8, 4]}>
        {unselectedTags.map((tag) => (
          <Tag
            key={tag.id}
            color={tag.color}
            className="hover:cursor-pointer"
            onClick={() => selectTag(tag.label)}
          >
            {tag.label}
          </Tag>
        ))}
      </Row>
    </>
  );
};
