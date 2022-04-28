import { ProjectIntegrationType, TaskDetails } from "@dewo/app/graphql/types";
import { Button, Dropdown, Menu, Typography } from "antd";
import * as Icons from "@ant-design/icons";
import React, { FC, useMemo } from "react";
import { useProjectIntegrations } from "../../project/hooks";
import { useCopyToClipboardAndShowToast } from "@dewo/app/util/hooks";

interface Props {
  task: TaskDetails;
}

export const TaskGithubBranchButton: FC<Props> = ({ task }) => {
  const integrations = useProjectIntegrations(task.projectId);
  const hasGithubIntegration = useMemo(
    () => integrations?.some((i) => i.type === ProjectIntegrationType.GITHUB),
    [integrations]
  );

  const copy = useCopyToClipboardAndShowToast();

  if (!hasGithubIntegration) return null;
  return (
    <Dropdown
      trigger={["click"]}
      overlay={
        <Menu>
          {[task.gitBranchName, `git checkout -b ${task.gitBranchName}`].map(
            (string) => (
              <Menu.Item key={string} onClick={() => copy(string)}>
                <Typography.Text code copyable>
                  {string}
                </Typography.Text>
              </Menu.Item>
            )
          )}
        </Menu>
      }
    >
      <Button size="small" icon={<Icons.BranchesOutlined />}>
        Link Github branch
      </Button>
    </Dropdown>
  );
};
