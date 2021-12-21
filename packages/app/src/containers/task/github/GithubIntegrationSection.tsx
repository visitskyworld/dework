import React, { FC, useMemo } from "react";
import { ProjectIntegrationSource, TaskDetails } from "@dewo/app/graphql/types";
import { FormSection } from "@dewo/app/components/FormSection";
import { GithubPullRequestRow } from "./GithubPullRequestRow";
import { GithubBranchRow } from "./GithubBranchRow";
import { useProjectIntegrations } from "../../project/hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { Typography } from "antd";
import { ConnectGithubAlert } from "./ConnectGithubAlert";

interface Props {
  task: TaskDetails;
}

export const GithubIntegrationSection: FC<Props> = ({ task }) => {
  const integrations = useProjectIntegrations(task.projectId);

  const canUpdateProject = usePermission("update", "Project");
  const hasGithubIntegration = useMemo(
    () =>
      !!integrations?.some((i) => i.source === ProjectIntegrationSource.github),
    [integrations]
  );

  const branchesWithoutPullRequests = useMemo(
    () =>
      task.githubBranches.filter(
        (branch) =>
          !task.githubPullRequests.some(
            (pr) => pr.branchName === branch.name
          ) && !branch.deletedAt
      ),
    [task.githubBranches, task.githubPullRequests]
  );

  if (!integrations) return null;
  if (!hasGithubIntegration && canUpdateProject) {
    return <ConnectGithubAlert projectId={task.projectId} />;
  }

  return (
    <>
      {!!task.githubPullRequests.length && (
        <FormSection label="Pull Requests">
          {task.githubPullRequests.map((pr) => (
            <GithubPullRequestRow key={pr.id} pullRequest={pr} />
          ))}
        </FormSection>
      )}
      {!!branchesWithoutPullRequests.length && (
        <FormSection label="Branches">
          {branchesWithoutPullRequests.map((branch) => (
            <GithubBranchRow key={branch.id} branch={branch} task={task} />
          ))}
        </FormSection>
      )}

      <FormSection label="Link Github Branch">
        <Typography.Paragraph
          type="secondary"
          className="ant-typography-caption"
        >
          Automatically link your task with a Github Pull Request using the
          branch name below
        </Typography.Paragraph>

        <Typography.Text
          copyable
          type="secondary"
          className="ant-input"
          style={{ display: "inline" }}
        >
          {`git checkout -b ${task.gitBranchName}`}
        </Typography.Text>
      </FormSection>
    </>
  );
};
