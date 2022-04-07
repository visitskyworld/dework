import { FormSection } from "@dewo/app/components/FormSection";
import { Button } from "antd";
import React, { FC, useMemo } from "react";
import { useProjectTasks } from "../hooks";
import { CSVLink } from "react-csv";
import { ExportOutlined } from "@ant-design/icons";
import { formatTaskReward } from "../../task/hooks";
import moment from "moment";
import { TaskDetails } from "@dewo/app/graphql/types";
interface Props {
  projectId: string;
  projectName: string;
}
export const ProjectTaskExports: FC<Props> = ({ projectId, projectName }) => {
  const tasks = useProjectTasks(projectId, "cache-and-network");

  const headers = useMemo(
    () => [
      { label: "Name", key: "name" },
      { label: "Tags", key: "tags" },
      { label: "Story Points", key: "storyPoints" },
      { label: "Status", key: "status" },
      { label: "Assignees", key: "assignees" },
      { label: "Reward", key: "reward" },
      { label: "Payment Type", key: "token" },
      { label: "Due Date", key: "dueDate" },
      { label: "Activities", key: "activities" },
    ],
    []
  );
  const csvData = useMemo(
    () =>
      tasks?.map((task) => ({
        name: task.name,
        tags: task.tags.map((tag) => tag.label),
        storyPoints: task.storyPoints,
        status: task.status,
        assignees: task.assignees.map((assignee) => assignee.username),
        reward: !!task.reward ? formatTaskReward(task.reward) : "",
        dueDate: task.dueDate ? moment(task.dueDate).format("LLL") : "",
        token: !!task.reward ? task.reward.token?.name : "",
        activities: `${
          (task as TaskDetails).creator?.username ?? "Someone"
        } created on ${moment(task.createdAt).format("lll")}${
          !!task.doneAt
            ? `, Task completed on ${moment(task.doneAt).format("lll")}`
            : ""
        }`,
      })) || [],
    [tasks]
  );
  return (
    <FormSection label="Export Tasks">
      <CSVLink
        filename={`${projectName}-tasks-list.csv`}
        data={csvData}
        headers={headers}
      >
        <Button
          type="ghost"
          icon={<ExportOutlined />}
          name="Export tasks as CSV"
        >
          Export CSV
        </Button>
      </CSVLink>
    </FormSection>
  );
};
