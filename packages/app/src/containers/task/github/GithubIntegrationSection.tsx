import React, { FC, useMemo } from "react";
import { TaskDetails } from "@dewo/app/graphql/types";
import { FormSection } from "@dewo/app/components/FormSection";
import { GithubPullRequestRow } from "./GithubPullRequestRow";
import { GithubBranchRow } from "./GithubBranchRow";
import { useProjectIntegrations } from "../../project/hooks";
import { Typography } from "antd";

interface Props {
  task: TaskDetails;
}

export const GithubIntegrationSection: FC<Props> = ({ task }) => {
  const integrations = useProjectIntegrations(task.projectId);

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
  return (
    <>
      {!!task.githubPullRequests.length && (
        <FormSection label="Pull Requests" className="mb-3">
          {task.githubPullRequests.map((pr) => (
            <GithubPullRequestRow key={pr.id} pullRequest={pr} />
          ))}
        </FormSection>
      )}
      {!!branchesWithoutPullRequests.length && (
        <FormSection label="Branches" className="mb-3">
          {branchesWithoutPullRequests.map((branch) => (
            <GithubBranchRow key={branch.id} branch={branch} task={task} />
          ))}
        </FormSection>
      )}

      {!task.githubBranches.length && (
        <FormSection label="Link Github Branch" className="mb-3">
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
      )}
    </>
  );
};
