import {
  SearchTasksInput,
  TaskStatus,
  TaskViewSortByDirection,
  TaskViewSortByField,
} from "@dewo/app/graphql/types";
import { Empty, Row, Skeleton, Spin, Typography } from "antd";
import React, { FC, useMemo, useState } from "react";
import { TaskTable } from "@dewo/app/containers/task/list/TaskTable";
import { useTaskViewLayoutData } from "@dewo/app/containers/task/views/hooks";
import { useMounted } from "@dewo/app/util/hooks";
import { useSkills } from "@dewo/app/containers/skills/hooks";
import { SkillTag } from "@dewo/app/components/SkillTag";

interface Props {
  organizationId: string;
}

export const OrganizationTaskDiscoveryList: FC<Props> = ({
  organizationId,
}) => {
  // const { user } = useAuthContext();
  const [skillIds, setSkillIds] = useState<string[]>(
    [] // () => user?.skills.map((s) => s.id) ?? []
  );
  const skills = useSkills();

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
          skillIds: !!skillIds.length ? skillIds : undefined,
          organizationId,
        },
      ],
      [organizationId, skillIds]
    )
  );

  const mounted = useMounted();

  return (
    <>
      <Typography.Title level={4}>Open Tasks</Typography.Title>
      <Skeleton loading={!mounted}>
        <Row gutter={[4, 8]} style={{ marginBottom: 16 }}>
          {skills?.map((skill) => {
            const selected = skillIds.includes(skill.id);
            return (
              <SkillTag
                key={skill.id}
                skill={skill}
                color={selected ? "blue" : undefined}
                className="hover:cursor-pointer"
                style={{
                  opacity: !!skillIds.length && !selected ? 0.5 : undefined,
                }}
                onClick={() =>
                  setSkillIds((prev) =>
                    selected
                      ? prev.filter((s) => s !== skill.id)
                      : [...prev, skill.id]
                  )
                }
              />
            );
          })}
        </Row>

        {!data.tasks?.length ? (
          data.loading ? (
            <div style={{ padding: 8, display: "grid", placeItems: "center" }}>
              <Spin />
            </div>
          ) : (
            <Empty
              imageStyle={{ display: "none" }}
              description={
                !!skillIds.length
                  ? "This DAO doesn't have any open tasks matching the selected skills at the moment!"
                  : "This DAO doesn't have any open tasks at the moment!"
              }
            />
          )
        ) : (
          <TaskTable data={data} showHeaders={false} />
        )}
      </Skeleton>
    </>
  );
};
