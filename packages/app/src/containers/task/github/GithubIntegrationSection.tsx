import React, { FC, useMemo } from "react";
import { ProjectIntegrationSource, Task } from "@dewo/app/graphql/types";
import { FormSection } from "@dewo/app/components/FormSection";
import { GithubPullRequestRow } from "./GithubPullRequestRow";
import { GithubBranchRow } from "./GithubBranchRow";
import * as Icons from "@ant-design/icons";
import { useProject, useProjectIntegrations } from "../../project/hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { Alert, Button, Typography } from "antd";
import { useConnectToGithubUrl } from "../../project/settings/ProjectGithubIntegrations";

interface Props {
  task: Task;
}

export const GithubIntegrationSection: FC<Props> = ({ task }) => {
  const integrations = useProjectIntegrations(task.projectId);

  const canUpdateProject = usePermission("update", "Project");
  const connectToGithubUrl = useConnectToGithubUrl(task.projectId);
  const hasGithubIntegration = useMemo(
    () =>
      !!integrations?.some((i) => i.source === ProjectIntegrationSource.github),
    [integrations]
  );

  const branchesWithoutPullRequests = useMemo(
    () =>
      task.githubBranches.filter(
        (branch) =>
          !task.githubPullRequests.some((pr) => pr.branchName === branch.name)
      ),
    [task.githubBranches, task.githubPullRequests]
  );

  if (!hasGithubIntegration && canUpdateProject) {
    // if (Math.random()) {
    return (
      <FormSection label="Github">
        <Alert
          message={
            <>
              <Typography.Text>
                Want to automatically link Github branches and make pull
                requests show up here? Set up our Github integration for this
                project.
              </Typography.Text>
              <br />
              <Button
                size="small"
                style={{ marginTop: 4 }}
                icon={<Icons.GithubOutlined />}
                href={connectToGithubUrl}
              >
                Connect to Github
              </Button>
            </>
          }
          closable
          onClose={
            // TODO(fant): make sure to not show this prompt for this project again
            undefined
          }
        />
      </FormSection>
    );
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
    </>
  );
};
