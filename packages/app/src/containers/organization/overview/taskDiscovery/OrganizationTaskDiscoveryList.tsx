import {
  SearchTasksInput,
  Task,
  TaskStatus,
  TaskViewSortByDirection,
  TaskViewSortByField,
} from "@dewo/app/graphql/types";
import { ConfigProvider, Empty, Row, Skeleton, Tag, Typography } from "antd";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import _ from "lodash";
import { TaskTable } from "@dewo/app/containers/task/list/TaskTable";
import { useTaskViewLayoutData } from "@dewo/app/containers/task/views/hooks";

interface Props {
  organizationId: string;
}

export const OrganizationTaskDiscoveryList: FC<Props> = ({
  organizationId,
}) => {
  const [data] = useTaskViewLayoutData(
    useMemo<SearchTasksInput[]>(
      () => [
        {
          statuses: [TaskStatus.TODO],
          sortBy: {
            field: TaskViewSortByField.createdAt,
            direction: TaskViewSortByDirection.DESC,
          },
          assigneeIds: [null],
          parentTaskId: null,
          organizationId,
        },
      ],
      [organizationId]
    )
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [selectedTagLabel, setSelectedTagLabel] = useState<string>();
  const tags = useMemo(() => {
    const tags = data.tasks?.map((task) => task.tags).flat();
    return _.uniqBy(tags, (t) => t.label);
  }, [data.tasks]);

  const shouldRenderTask = useCallback(
    (task: Task) =>
      !selectedTagLabel ||
      task.tags.some((tag) => tag.label === selectedTagLabel),
    [selectedTagLabel]
  );

  return (
    <>
      <Typography.Title level={4}>Open Tasks</Typography.Title>
      <Skeleton loading={!mounted || data.loading}>
        {tags?.length > 0 && (
          <>
            <Row style={{ marginBottom: 8 }}>
              <Typography.Text
                type="secondary"
                className="ant-typography-caption"
              >
                Click on tags to show tasks for
              </Typography.Text>
            </Row>
            <Row gutter={[4, 8]} style={{ marginBottom: 16 }}>
              {tags.map((tag) => (
                <Tag
                  key={tag.id}
                  color={selectedTagLabel !== tag.label ? undefined : tag.color}
                  className="hover:cursor-pointer"
                  style={{
                    opacity:
                      !!selectedTagLabel && selectedTagLabel !== tag.label
                        ? 0.5
                        : undefined,
                  }}
                  onClick={() =>
                    setSelectedTagLabel((prevValue) =>
                      prevValue === tag.label ? undefined : tag.label
                    )
                  }
                >
                  {tag.label}
                </Tag>
              ))}
            </Row>
          </>
        )}

        <ConfigProvider
          renderEmpty={() => (
            <Empty
              imageStyle={{ display: "none" }}
              description="This DAO doesn't have any open tasks at the moment!"
            />
          )}
        >
          <TaskTable
            data={data}
            showHeaders={false}
            shouldRenderTask={shouldRenderTask}
          />
        </ConfigProvider>
      </Skeleton>
    </>
  );
};
