import React, { FC, useMemo } from "react";
import { ProjectIntegrationType, TaskDetails } from "@dewo/app/graphql/types";
import { FormSection } from "@dewo/app/components/FormSection";
import { GithubPullRequestRow } from "./GithubPullRequestRow";
import { GithubBranchRow } from "./GithubBranchRow";
import { useProjectIntegrations } from "../../project/hooks";

interface Props {
  task: TaskDetails;
}

export const GithubIntegrationSection: FC<Props> = ({ task }) => {
  const integrations = useProjectIntegrations(task.projectId);
  const hasGithubIntegration = useMemo(
    () => integrations?.some((i) => i.type === ProjectIntegrationType.GITHUB),
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

  if (!hasGithubIntegration) return null;
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
    </>
  );
};
