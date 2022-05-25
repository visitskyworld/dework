import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import {
  RulePermission,
  SearchTasksInput,
  Task,
  TaskStatus,
  TaskViewSortByDirection,
  TaskViewSortByField,
} from "@dewo/app/graphql/types";
import { stopPropagation } from "@dewo/app/util/eatClick";
import { useRunning } from "@dewo/app/util/hooks";
import { useNavigateToTaskFn } from "@dewo/app/util/navigation";
import {
  Avatar,
  Button,
  Collapse,
  Divider,
  Layout,
  Row,
  Skeleton,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import moment from "moment";
import React, { FC, ReactNode, useCallback, useMemo } from "react";
import { Header } from "../../navigation/header/Header";
import { useOrganizationRoles } from "../../rbac/hooks";
import { RBACPermissionForm } from "../../rbac/RBACPermissionForm";
import { TaskList } from "../../task/list/TaskList";
import { TaskRewardTag } from "../../task/TaskRewardTag";
import { useTaskViewLayoutData } from "../../task/views/hooks";
import {
  useCloseFundingSession,
  useFundingSession,
  useSetFundingVote,
} from "../hooks";

interface Props {
  id: string;
}

interface VoteType {
  emoji: string;
  weight: number;
  tooltip: string;
}

const voteTypes: VoteType[] = [
  { emoji: "🙂", weight: 1, tooltip: "Met expectations" },
  { emoji: "😄", weight: 3, tooltip: "Exceeded expectations" },
];

export const FundingSessionOverview: FC<Props> = ({ id }) => {
  const canClose = usePermission("update", "FundingSession");
  const navigateToTask = useNavigateToTaskFn();

  const session = useFundingSession(id);
  const roles = useOrganizationRoles(session?.organizationId);

  const closed = !!session?.closedAt;
  const data = useTaskViewLayoutData(
    useMemo(
      (): SearchTasksInput[] =>
        !!session
          ? [
              {
                statuses: [TaskStatus.DONE],
                sortBy: {
                  field: TaskViewSortByField.createdAt,
                  direction: TaskViewSortByDirection.ASC,
                },
                projectIds: session.projects.map((p) => p.id),
                doneAt: { gte: session.startDate, lt: session.endDate },
                parentTaskId: null,
              },
            ]
          : [],
      [session]
    ),
    { filter: useCallback((t: Task) => !t.reward?.fundingSessionId, []) }
  );

  const closeSession = useCloseFundingSession();
  const [handleClose, closing] = useRunning(
    useCallback(() => closeSession(id), [id, closeSession])
  );

  const { user } = useAuthContext();
  const setFundingVote = useSetFundingVote();
  const myVotes = useMemo(
    () => session?.votes.filter((v) => v.userId === user?.id),
    [user?.id, session?.votes]
  );
  const renderTaskExtra = useCallback(
    (task: Task): ReactNode => {
      const currentWeight = myVotes?.find((v) => v.taskId === task.id)?.weight;
      const vote = (weight: number) => (e: any) => {
        stopPropagation(e);
        setFundingVote({
          taskId: task.id,
          sessionId: id,
          weight: weight === currentWeight ? 0 : weight,
        });
      };
      return (
        <>
          <Divider type="vertical" style={{ height: 24 }} />
          {voteTypes.map((voteType, index) => (
            <Tooltip key={index} title={voteType.tooltip}>
              <Button
                type={currentWeight === voteType.weight ? "primary" : "text"}
                children={voteType.emoji}
                shape="circle"
                disabled={closed}
                style={{ fontSize: "110%" }}
                onClick={vote(voteType.weight)}
              />
            </Tooltip>
          ))}
        </>
      );
    },
    [myVotes, id, setFundingVote, closed]
  );

  return (
    <Layout.Content style={{ display: "flex", flexDirection: "column" }}>
      <Header
        title="Tipping"
        extra={
          canClose &&
          !!session &&
          !closed && (
            <Button type="primary" loading={closing} onClick={handleClose}>
              Close Tipping Session
            </Button>
          )
        }
      />
      <div
        className="dewo-layout-padding-vertical"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          rowGap: 24,
          overflowY: "auto",
          paddingBottom: 24,
        }}
      >
        <Skeleton loading={!session}>
          {!!session && (
            <>
              <Collapse
                defaultActiveKey={
                  closed
                    ? ["details", "voters", "tips"]
                    : ["details", "voters", "tasks"]
                }
                bordered={false}
              >
                <Collapse.Panel header="Details" key="details">
                  <Space direction="vertical">
                    <Row style={{ columnGap: 8 }}>
                      <Typography.Text type="secondary" style={{ width: 60 }}>
                        Date:
                      </Typography.Text>
                      {[session.startDate, session.endDate]
                        .map((d) => moment(d).format("MMM D"))
                        .join(" - ")}
                      {closed ? (
                        <Tag color="blue">Closed</Tag>
                      ) : (
                        <Tag color="green">Open</Tag>
                      )}
                    </Row>
                    <Row style={{ columnGap: 8 }}>
                      <Typography.Text type="secondary" style={{ width: 60 }}>
                        Budget:
                      </Typography.Text>
                      <TaskRewardTag
                        reward={{
                          amount: session.amount,
                          token: session.token,
                        }}
                      />
                    </Row>
                    <Row style={{ columnGap: 8 }}>
                      <Typography.Text type="secondary" style={{ width: 60 }}>
                        Projects:
                      </Typography.Text>
                      {session.projects.map((p) => p.name).join(", ")}
                    </Row>
                  </Space>
                </Collapse.Panel>
                <Collapse.Panel header="Voters" key="voters">
                  {!!session.voters.length ? (
                    <Avatar.Group size="large">
                      {session.voters.map((user) => (
                        <UserAvatar key={user.id} user={user} linkToProfile />
                      ))}
                    </Avatar.Group>
                  ) : (
                    <Typography.Text type="secondary">
                      No voters yet
                    </Typography.Text>
                  )}

                  {!!roles && (
                    <>
                      <Divider />
                      <Typography.Title level={5}>
                        Who can vote?
                      </Typography.Title>
                      <RBACPermissionForm
                        organizationId={session.organizationId}
                        fundingSessionId={session.id}
                        permission={RulePermission.MANAGE_FUNDING}
                        roles={roles}
                      />
                    </>
                  )}
                </Collapse.Panel>
                {!!session.rewards.length && (
                  <Collapse.Panel header="Tips" key="tips">
                    {session.rewards.map((reward) => (
                      <Button
                        key={reward.id}
                        type="text"
                        onClick={() =>
                          navigateToTask(
                            reward.task.parentTask?.id ?? reward.task.id
                          )
                        }
                      >
                        <Typography.Text style={{ marginRight: 16 }}>
                          {reward.task.parentTask?.name}
                        </Typography.Text>
                        <TaskRewardTag reward={reward} />
                      </Button>
                    ))}
                  </Collapse.Panel>
                )}
                <Collapse.Panel header="Completed Tasks" key="tasks">
                  <div style={{ height: 500 }}>
                    <TaskList
                      showHeaders={false}
                      data={data}
                      renderTaskExtra={!!user ? renderTaskExtra : undefined}
                    />
                  </div>
                </Collapse.Panel>
              </Collapse>
            </>
          )}
        </Skeleton>
      </div>
    </Layout.Content>
  );
};
