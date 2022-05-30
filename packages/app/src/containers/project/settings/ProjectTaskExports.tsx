import { FormSection } from "@dewo/app/components/FormSection";
import { Button } from "antd";
import React, { FC, useCallback, useMemo, useRef } from "react";
import { CSVLink } from "react-csv";
import { ExportOutlined } from "@ant-design/icons";
import { formatTaskReward } from "../../task/hooks";
import moment from "moment";
import {
  GetProjectTasksExportQuery,
  GetProjectTasksExportQueryVariables,
  ThreepidSource,
} from "@dewo/app/graphql/types";
import { useLazyQuery } from "@apollo/client";
import * as Queries from "@dewo/app/graphql/queries";
import { useRunning } from "@dewo/app/util/hooks";
interface Props {
  projectId: string;
  projectName: string;
}

export const ProjectTaskExports: FC<Props> = ({ projectId, projectName }) => {
  const csvRef = useRef<any>();
  const [loadProjectTasksExports, { data }] = useLazyQuery<
    GetProjectTasksExportQuery,
    GetProjectTasksExportQueryVariables
  >(Queries.projectTasksExport, { ssr: false });
  const headers = useMemo(
    () => [
      { label: "Name", key: "name" },
      { label: "Tags", key: "tags" },
      { label: "Story Points", key: "storyPoints" },
      { label: "Status", key: "status" },
      { label: "Assignees", key: "assignees" },
      { label: "Wallet Address", key: "address" },
      { label: "Reward", key: "reward" },
      { label: "Due Date", key: "dueDate" },
      { label: "Activities", key: "activities" },
    ],
    []
  );

  const csvData = useMemo(
    () =>
      data?.project.tasks.map((task) => ({
        name: task.name,
        tags: task.tags.map((tag) => tag.label),
        storyPoints: task.storyPoints,
        status: task.status,
        assignees: task.assignees.map((assignee) => assignee.username),
        address: task.assignees?.map(
          (t) =>
            t.threepids.find((t) => t.source === ThreepidSource.metamask)
              ?.address
        ),
        reward: task.rewards.map(formatTaskReward).join(", "),
        dueDate: task.dueDate ? moment(task.dueDate).format("LLL") : "",
        activities: `${task.creator?.username ?? "Someone"} created on ${moment(
          task.createdAt
        ).format("lll")}${
          !!task.doneAt
            ? `, Task completed on ${moment(task.doneAt).format("lll")}`
            : ""
        }`,
      })),
    [data?.project.tasks]
  );

  const [handleExport, exporting] = useRunning(
    useCallback(async () => {
      await loadProjectTasksExports({ variables: { projectId: projectId! } });
      csvRef.current?.link?.click();
    }, [loadProjectTasksExports, projectId])
  );

  return (
    <FormSection label="Export Tasks">
      <Button
        loading={exporting}
        icon={<ExportOutlined />}
        onClick={handleExport}
        name="Export tasks as CSV"
      >
        Export CSV
      </Button>
      {!!csvData && (
        <CSVLink
          ref={csvRef}
          filename={`${projectName}-tasks-list.csv`}
          data={csvData}
          headers={headers}
        />
      )}
    </FormSection>
  );
};
