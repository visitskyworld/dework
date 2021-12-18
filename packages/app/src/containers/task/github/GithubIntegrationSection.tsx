import React, { FC, useMemo } from "react";
import { Task } from "@dewo/app/graphql/types";
import { FormSection } from "@dewo/app/components/FormSection";
import { GithubPullRequestRow } from "./GithubPullRequestRow";
import { GithubBranchRow } from "./GithubBranchRow";

interface Props {
  task: Task;
}

export const GithubIntegrationSection: FC<Props> = ({ task }) => {
  const branchesWithoutPullRequests = useMemo(
    () =>
      task.githubBranches.filter(
        (branch) =>
          !task.githubPullRequests.some((pr) => pr.branchName === branch.name)
      ),
    [task.githubBranches, task.githubPullRequests]
  );

  return (
    <>
      {!!task.githubPullRequests.length && (
        <FormSection label="Pull Requests">
          {task.githubPullRequests.map((pr) => (
            <GithubPullRequestRow key={pr.id} pullRequest={pr} />
          ))}
        </FormSection>
      )}
      {!!branchesWithoutPullRequests && (
        <FormSection label="Branches">
          {branchesWithoutPullRequests.map((branch) => (
            <GithubBranchRow key={branch.id} branch={branch} task={task} />
          ))}
        </FormSection>
      )}
    </>
  );
};
