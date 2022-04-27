import { TaskStatus } from "@dewo/app/graphql/types";
import { Row, Skeleton, Tag, Typography } from "antd";
import React, { FC, useEffect, useMemo, useState } from "react";
import { useOrganizationTasks } from "../../hooks";
import _ from "lodash";
import { TaskList } from "@dewo/app/containers/task/list/TaskList";

interface Props {
  organizationId: string;
}

export const OrganizationTaskDiscoveryList: FC<Props> = ({
  organizationId,
}) => {
  const organization = useOrganizationTasks(
    organizationId,
    { statuses: [TaskStatus.TODO], userId: null },
    "cache-first"
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [selectedTagLabel, setSelectedTagLabel] = useState<string>();
  const tags = useMemo(() => {
    const tags = organization?.tasks.map((task) => task.tags).flat();
    return _.uniqBy(tags, (t) => t.label);
  }, [organization]);
  const filteredTasks = useMemo(
    () =>
      organization?.tasks.filter(
        (t) =>
          !selectedTagLabel ||
          t.tags.some((tag) => tag.label === selectedTagLabel)
      ),
    [organization?.tasks, selectedTagLabel]
  );

  return (
    <>
      <Typography.Title level={4}>Open Tasks</Typography.Title>
      <Skeleton loading={!mounted || !organization}>
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

        {!organization?.tasks.length ? (
          <Typography.Paragraph type="secondary">
            This DAO doesn't have any open tasks at the moment!
          </Typography.Paragraph>
        ) : (
          !!filteredTasks && (
            <TaskList tasks={filteredTasks} showHeaders={false} mode="table" />
          )
        )}
      </Skeleton>
    </>
  );
};
