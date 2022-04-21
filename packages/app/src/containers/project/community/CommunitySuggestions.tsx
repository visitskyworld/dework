import {
  Button,
  Dropdown,
  Layout,
  Menu,
  PageHeader,
  Spin,
  Typography,
} from "antd";
import React, { FC, useEffect, useMemo, useState } from "react";
import { useProjectTasks } from "../hooks";
import * as Icons from "@ant-design/icons";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { TaskCreateModal } from "../../task/TaskCreateModal";
import { Task, TaskStatus } from "@dewo/app/graphql/types";
import { useToggle } from "@dewo/app/util/hooks";
import _ from "lodash";
import { SuggestionsList } from "./SuggestionsList";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { LoginButton } from "../../auth/buttons/LoginButton";

const UPVOTE_REACTION = ":arrow_up_small:";

enum SortBy {
  trending = "trending",
  recent = "recent",
}

export interface TaskRow {
  task: Task;
  upvotes: number;
}

const sortByUpvotes = (a: TaskRow, b: TaskRow) => {
  return b.upvotes - a.upvotes;
};
const sortByRecent = (a: TaskRow, b: TaskRow) => {
  return (
    new Date(b.task.createdAt).getTime() - new Date(a.task.createdAt).getTime()
  );
};

const sortByTextMap: Record<SortBy, string> = {
  [SortBy.trending]: "Trending",
  [SortBy.recent]: "Recent",
};
const sortFnMap = {
  [SortBy.recent]: sortByRecent,
  [SortBy.trending]: sortByUpvotes,
};

interface Props {
  projectId: string;
}

export const CommunitySuggestions: FC<Props> = ({ projectId }) => {
  const authenticated = !!useAuthContext().user;
  const tasks = useProjectTasks(projectId, "cache-and-network");

  const [mode, setMode] = useState(SortBy.trending);

  const taskRows = useMemo<TaskRow[]>(
    () =>
      tasks
        ?.filter((t) => t.status === TaskStatus.BACKLOG)
        .map((task) => ({
          task,
          upvotes: _.sumBy(task.reactions, (reaction) =>
            reaction.reaction === UPVOTE_REACTION ? 1 : 0
          ),
        }))
        .sort(sortFnMap[mode]) ?? [],
    [tasks, mode]
  );

  const canCreateTask = usePermission("create", {
    __typename: "Task",
    projectId,
    // @ts-ignore
    ...{ ownerIds: [] },
    status: TaskStatus.BACKLOG,
  });
  const createTaskToggle = useToggle();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div style={{ display: "grid", placeItems: "center", padding: 40 }}>
        <Spin />
      </div>
    );
  }
  return (
    <div className="w-full max-w-md mx-auto">
      <PageHeader
        title={
          <Dropdown
            trigger={["click"]}
            overlay={
              <Menu selectedKeys={[mode]}>
                {(Object.keys(sortByTextMap) as SortBy[]).map((key) => (
                  <Menu.Item key={key} onClick={() => setMode(key)}>
                    {sortByTextMap[key]}
                  </Menu.Item>
                ))}
              </Menu>
            }
          >
            <Typography.Title level={4}>
              {sortByTextMap[mode]}
              <Icons.DownOutlined style={{ paddingLeft: 8 }} />
            </Typography.Title>
          </Dropdown>
        }
        extra={
          canCreateTask &&
          (authenticated ? (
            <Button
              icon={<Icons.PlusOutlined />}
              type="primary"
              onClick={createTaskToggle.toggleOn}
            >
              Add a suggestion
            </Button>
          ) : (
            <LoginButton icon={<Icons.PlusOutlined />} type="primary">
              Add a suggestion
            </LoginButton>
          ))
        }
      ></PageHeader>
      <Layout.Content>
        <SuggestionsList taskRows={taskRows} />
      </Layout.Content>

      <TaskCreateModal
        projectId={projectId}
        initialValues={{ status: TaskStatus.BACKLOG }}
        visible={createTaskToggle.isOn}
        onCancel={createTaskToggle.toggleOff}
        onDone={createTaskToggle.toggleOff}
      />
    </div>
  );
};
