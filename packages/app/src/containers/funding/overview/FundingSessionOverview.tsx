import { FormSection } from "@dewo/app/components/FormSection";
import { QuestionmarkTooltip } from "@dewo/app/components/QuestionmarkTooltip";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import {
  RulePermission,
  SearchTasksInput,
  Task,
  TaskStatus,
  TaskViewField,
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
  message,
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
import { TaskViewFieldsProvider } from "../../task/views/TaskViewFieldsContext";
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
  // { emoji: "🙂", weight: 1, tooltip: "Met expectations" },
  { emoji: "😄", weight: 1, tooltip: "Beat expectations" },
  { emoji: "😍", weight: 3, tooltip: "Outstanding work" },
];

const fields: TaskViewField[] = [
  TaskViewField.name,
  TaskViewField.assignees,
  TaskViewField.doneAt,
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
    {
      filter: useCallback(
        (t: Task) => !t.rewards.some((r) => !!r.fundingSessionId),
        []
      ),
    }
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
      const vote = (weight: number) => async (e: any) => {
        stopPropagation(e);
        await setFundingVote({
          taskId: task.id,
          sessionId: id,
          weight: weight === currentWeight ? 0 : weight,
        });
        message.success("Your vote has been saved");
      };
      return (
        <>
          <Divider type="vertical" style={{ height: 24 }} />
          {voteTypes.map((voteType, index) => (
            <Tooltip key={index} title={voteType.tooltip}>
              <Button
                type={currentWeight === voteType.weight ? "primary" : "default"}
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

  const usersWhoVoted = useMemo(
    () => session?.voters.filter((v) => !!v.votes.length).map((v) => v.user),
    [session?.voters]
  );
  const usersWhoHaveNotVoted = useMemo(
    () => session?.voters.filter((v) => !v.votes.length).map((v) => v.user),
    [session?.voters]
  );

  return (
    <Layout.Content style={{ display: "flex", flexDirection: "column" }}>
      <Header
        title="Tipping"
        extra={
          canClose &&
          !!session &&
          !closed && (
            <Button loading={closing} onClick={handleClose}>
              Complete Reward Session
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
                    ? ["details", "rewarders", "tips"]
                    : ["details", "rewarders", "tasks"]
                }
                bordered={false}
              >
                <Collapse.Panel header="Details" key="details">
                  <Space direction="vertical">
                    <Row style={{ columnGap: 8 }}>
                      <Typography.Text type="secondary" style={{ width: 80 }}>
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
                <Collapse.Panel
                  header={
                    <>
                      <Typography.Text>Rewarders</Typography.Text>
                      <QuestionmarkTooltip
                        marginLeft={8}
                        title="Rewarders' weighting power are proportional to how many tasks they've reviewed during the given reward session. The reward budget is distributed based on the rewarder's votes."
                      />
                    </>
                  }
                  key="rewarders"
                >
                  {!!usersWhoVoted?.length && (
                    <FormSection
                      label={
                        <Typography.Text type="secondary">
                          Rewarders
                        </Typography.Text>
                      }
                    >
                      <Avatar.Group size="small">
                        {usersWhoVoted.map((u) => (
                          <UserAvatar key={u.id} user={u} linkToProfile />
                        ))}
                      </Avatar.Group>
                    </FormSection>
                  )}
                  {!!usersWhoHaveNotVoted?.length && (
                    <FormSection
                      label={
                        <Typography.Text type="secondary">
                          Waiting for rewarders
                        </Typography.Text>
                      }
                    >
                      <Avatar.Group size="small">
                        {usersWhoHaveNotVoted.map((u) => (
                          <UserAvatar key={u.id} user={u} linkToProfile />
                        ))}
                      </Avatar.Group>
                    </FormSection>
                  )}
                </Collapse.Panel>
                <Collapse.Panel
                  header={
                    <>
                      <Typography.Text>Who can reward?</Typography.Text>
                      <QuestionmarkTooltip
                        marginLeft={8}
                        title="If someone has a specific Discord role but hasn't reviewed any tasks during the tipping session, their weighting power is zero."
                      />
                    </>
                  }
                  key="access"
                >
                  {!!roles && (
                    <RBACPermissionForm
                      organizationId={session.organizationId}
                      fundingSessionId={session.id}
                      permission={RulePermission.MANAGE_FUNDING}
                      roles={roles}
                    />
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
                  <Typography.Paragraph
                    type="secondary"
                    style={{ marginBottom: 0 }}
                  >
                    Vote on tasks by selecting emojis to the right of each task.
                  </Typography.Paragraph>
                  <div style={{ minHeight: 500, height: "70vh" }}>
                    <TaskViewFieldsProvider fields={fields}>
                      <TaskList
                        showHeaders={false}
                        data={data}
                        renderTaskExtra={!!user ? renderTaskExtra : undefined}
                      />
                    </TaskViewFieldsProvider>
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
