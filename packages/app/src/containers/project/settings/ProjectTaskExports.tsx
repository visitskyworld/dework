import { FormSection } from "@dewo/app/components/FormSection";
import { Button } from "antd";
import React, { FC, useMemo } from "react";
import { useProjectTasks } from "../hooks";
import { CSVLink } from "react-csv";
import { ExportOutlined } from "@ant-design/icons";
import { formatTaskReward } from "../../task/hooks";
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
      { label: "Points", key: "storyPoints" },
      { label: "Status", key: "status" },
      { label: "Assignees", key: "assignees" },
      { label: "Reward", key: "reward" },
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
        <Button type="ghost" icon={<ExportOutlined />}>
          Export CSV
        </Button>
      </CSVLink>
    </FormSection>
  );
};
