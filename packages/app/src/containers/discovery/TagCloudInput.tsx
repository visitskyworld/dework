import { TaskTag } from "@dewo/app/graphql/types";
import { Divider, Input, Row, Tag, Typography } from "antd";
import _ from "lodash";
import React, {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MoreSectionCollapse } from "@dewo/app/components/MoreSectionCollapse";
import { useToggle } from "@dewo/app/util/hooks";

interface Props {
  mainTags: { label: string; color: string }[];
  moreTags?: TaskTag[];
  value?: string[];
  onChange?(value: string[]): void;
}

export const TagCloudInput: FC<Props> = ({
  mainTags,
  moreTags,
  value: selectedTagLabels,
  onChange,
}) => {
  const [searchText, setSearchText] = useState("");
  const onChangeSearch = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setSearchText(event.target.value),
    []
  );
  const moreSectionToggle = useToggle();
  const filteredMainTags = useMemo(
    () =>
      mainTags.filter((tag) =>
        tag.label.toLowerCase().includes(searchText.toLowerCase())
      ),
    [mainTags, searchText]
  );
  const filteredMoreTags = useMemo(
    () =>
      moreTags
        ?.map((moreTag) => ({ ...moreTag, label: moreTag.label.toLowerCase() }))
        .filter(
          (moreTag) =>
            !mainTags.some(
              (mainTag) => mainTag.label.toLowerCase() === moreTag.label
            ) && moreTag.label.includes(searchText.toLowerCase())
        ),
    [mainTags, moreTags, searchText]
  );
  const [selectedMainTags, unselectedMainTags] = useMemo(
    () =>
      _.partition(
        filteredMainTags,
        (t) => !!selectedTagLabels?.includes(t.label)
      ),
    [selectedTagLabels, filteredMainTags]
  );
  const [selectedMoreTags, unselectedMoreTags] = useMemo(
    () =>
      _.partition(
        filteredMoreTags,
        (t) => !!selectedTagLabels?.includes(t.label)
      ),
    [selectedTagLabels, filteredMoreTags]
  );
  const unselectedTags = useMemo(
    () => [...unselectedMainTags, ...unselectedMoreTags],
    [unselectedMainTags, unselectedMoreTags]
  );
  const selectedTags = useMemo(
    () => [...selectedMainTags, ...selectedMoreTags],
    [selectedMainTags, selectedMoreTags]
  );

  useEffect(() => {
    if (!!searchText && !!moreTags?.length && !moreSectionToggle.isOn) {
      moreSectionToggle.toggleOn();
    }
  }, [searchText, moreTags, moreSectionToggle]);

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
      <div className="mx-auto max-w-md w-full mb-2">
        <Input
          placeholder="Search Tags..."
          allowClear
          onChange={onChangeSearch}
        />
      </div>
      {!!selectedTags.length && (
        <>
          <Row gutter={[8, 4]}>
            {selectedTags.map((tag) => (
              <Tag
                key={tag.label}
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
      {unselectedTags?.length > 0 && (
        <>
          {unselectedMoreTags?.length > 0 && (
            <Typography.Text
              type="secondary"
              className="ant-typography-caption"
            >
              Click on tags to show tasks for
            </Typography.Text>
          )}
          <Row gutter={[8, 4]}>
            {unselectedMainTags.map((tag) => (
              <Tag
                key={tag.label}
                color={tag.color}
                className="hover:cursor-pointer"
                onClick={() => selectTag(tag.label)}
              >
                {tag.label}
              </Tag>
            ))}
          </Row>
          <MoreSectionCollapse label="More" toggle={moreSectionToggle}>
            <Row gutter={[8, 4]}>
              {unselectedMoreTags.map((tag) => (
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
          </MoreSectionCollapse>
        </>
      )}
    </>
  );
};
