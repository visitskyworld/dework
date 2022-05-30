import { ProjectIntegrationType, TaskDetails } from "@dewo/app/graphql/types";
import { Button, Dropdown, Menu, Typography } from "antd";
import * as Icons from "@ant-design/icons";
import React, { FC, useMemo } from "react";
import { useProjectIntegrations } from "../../project/hooks";
import { useCopyToClipboardAndShowToast } from "@dewo/app/util/hooks";
import { QuestionmarkTooltip } from "@dewo/app/components/QuestionmarkTooltip";

interface Props {
  task: TaskDetails;
}

const MenuItem: FC<{ text: string; tooltip?: string }> = ({
  text,
  tooltip,
}) => {
  const copy = useCopyToClipboardAndShowToast();
  return (
    <Menu.Item onClick={() => copy(text)}>
      <Typography.Text code copyable>
        {text}
      </Typography.Text>
      {!!tooltip && <QuestionmarkTooltip title={tooltip} />}
    </Menu.Item>
  );
};

export const TaskGithubBranchButton: FC<Props> = ({ task }) => {
  const integrations = useProjectIntegrations(task.projectId);
  const hasGithubIntegration = useMemo(
    () => integrations?.some((i) => i.type === ProjectIntegrationType.GITHUB),
    [integrations]
  );

  if (!hasGithubIntegration) return null;
  return (
    <Dropdown
      trigger={["click"]}
      overlay={
        <Menu>
          <MenuItem
            text={task.gitBranchName}
            tooltip={`This is a suggested branch name. The Github integration links git branches to Dework tasks using the "dw-${task.number}" identifier, so as long as your branch name contains that, it will get linked to this task.`}
          />
          <MenuItem text={`git checkout -b ${task.gitBranchName}`} />
        </Menu>
      }
    >
      <Button size="small" icon={<Icons.BranchesOutlined />}>
        Link Github branch
      </Button>
    </Dropdown>
  );
};
