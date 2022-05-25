import {
  SearchTasksInput,
  Skill,
  TaskStatus,
  TaskViewSortByDirection,
  TaskViewSortByField,
} from "@dewo/app/graphql/types";
import {
  Button,
  Col,
  Divider,
  Empty,
  Row,
  Skeleton,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd";
import React, { FC, useMemo, useState } from "react";
import { TaskTable } from "@dewo/app/containers/task/list/TaskTable";
import { useTaskViewLayoutData } from "@dewo/app/containers/task/views/hooks";
import { useLocalState, useMounted } from "@dewo/app/util/hooks";
import { useSkills } from "@dewo/app/containers/skills/hooks";
import { SkillTag } from "@dewo/app/components/SkillTag";
import { DropdownSelect } from "@dewo/app/components/DropdownSelect";
import * as Icons from "@ant-design/icons";
import styles from "./OrganizationTaskDiscoveryList.module.less";

interface Props {
  organizationId: string;
}

enum SortBy {
  recent = "recent",
  high = "high",
  recentBounties = "recentBounties",
}

const SortNameMapping: Partial<Record<SortBy, string>> = {
  [SortBy.high]: "Highest bounties",
  [SortBy.recentBounties]: "Recent bounties",
};

export const OrganizationTaskDiscoveryList: FC<Props> = ({
  organizationId,
}) => {
  // const { user } = useAuthContext();
  const [skillIds, setSkillIds] = useState<string[]>(
    [] // () => user?.skills.map((s) => s.id) ?? []
  );
  const skills = useSkills();

  const [sortBy, setSortBy] = useLocalState<SortBy>(
    `Organization.${organizationId}.sortBy`,
    SortBy.high
  );

  const [data] = useTaskViewLayoutData(
    useMemo(
      (): SearchTasksInput[] => [
        {
          statuses: [TaskStatus.TODO],
          sortBy: {
            field:
              sortBy === SortBy.high
                ? TaskViewSortByField.reward
                : TaskViewSortByField.createdAt,
            direction: TaskViewSortByDirection.DESC,
          },
          hasReward: sortBy === SortBy.recentBounties ? true : undefined,
          assigneeIds: [null],
          parentTaskId: null,
          skillIds: !!skillIds.length ? skillIds : undefined,
          organizationIds: [organizationId],
        },
      ],
      [organizationId, skillIds, sortBy]
    )
  );

  const mounted = useMounted();

  return (
    <>
      <Row wrap={false}>
        <Col flex={1}>
          <Typography.Title ellipsis level={4}>
            Open Tasks
          </Typography.Title>
        </Col>
        <Col>
          <Space>
            <DropdownSelect<string[]>
              mode="multiple"
              options={skills?.map((s) => ({
                label: `${s.emoji} ${s.name}`,
                value: s.id,
              }))}
              value={skillIds}
              onChange={setSkillIds}
            >
              <Button>
                Skills
                <Icons.DownOutlined />
              </Button>
            </DropdownSelect>
            <DropdownSelect<SortBy>
              mode="default"
              options={[SortBy.recentBounties, SortBy.high].map((sortBy) => ({
                label: SortNameMapping[sortBy],
                value: sortBy,
              }))}
              value={sortBy}
              onChange={setSortBy}
            >
              <Button>
                Bounty
                <Icons.DownOutlined />
              </Button>
            </DropdownSelect>
          </Space>
        </Col>
      </Row>

      <Skeleton loading={!mounted}>
        <Row gutter={[4, 8]} style={{ marginBottom: 16 }}>
          <Space size="small" className={styles.hideFirst}>
            {skillIds.length > 0 && (
              <>
                <Divider type="vertical" />
                <Typography.Text type="secondary">Skills:</Typography.Text>
                {skillIds
                  .map((id) => skills?.find((s) => s.id === id))
                  .filter((s): s is Skill => !!s)
                  .map((skill) => {
                    const handleClick = () =>
                      setSkillIds((prev) => prev.filter((s) => s !== skill.id));

                    return (
                      <SkillTag
                        key={skill.id}
                        closable
                        onClose={handleClick}
                        skill={skill}
                        color="blue"
                        className="hover:cursor-pointer"
                        onClick={handleClick}
                      />
                    );
                  })}
              </>
            )}
            {sortBy !== SortBy.recent && (
              <>
                <Divider type="vertical" />
                <Typography.Text type="secondary">Sort:</Typography.Text>
                <Tag closable onClose={() => setSortBy(SortBy.recent)}>
                  {SortNameMapping[sortBy]}
                </Tag>
              </>
            )}
          </Space>
        </Row>

        {!data.tasks?.length ? (
          data.loading ? (
            <div
              style={{
                padding: 8,
                display: "grid",
                placeItems: "center",
                marginBottom: 650,
              }}
            >
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
