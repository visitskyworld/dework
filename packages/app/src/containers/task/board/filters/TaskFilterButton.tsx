import React, { CSSProperties, FC, useMemo } from "react";
import * as Icons from "@ant-design/icons";
import { Button, Popover } from "antd";
import { useTaskFilter } from "./FilterContext";
import {
  useProject,
  useProjectTaskTags,
} from "@dewo/app/containers/project/hooks";
import _ from "lodash";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import {
  useOrganizationTaskTags,
  useOrganizationUsers,
  useOrganizationDetails,
} from "@dewo/app/containers/organization/hooks";
import {
  TaskTag,
  User,
  OrganizationDetails_projects,
} from "@dewo/app/graphql/types";
import { TaskFilterForm } from "./TaskFilterForm";

interface TaskFilterButtonProps {
  users?: User[];
  tags?: TaskTag[];
  style?: CSSProperties;
  projects?: OrganizationDetails_projects[];
}

const TaskFilterButton: FC<TaskFilterButtonProps> = ({
  users,
  tags,
  style,
  projects,
}) => {
  const { filter } = useTaskFilter();
  const screens = useBreakpoint();
  const filterCount = useMemo(
    () =>
      _.sum([
        filter.tagIds?.length,
        filter.assigneeIds?.length,
        filter.ownerIds?.length,
        filter.projectIds?.length,
        Number(!!filter.quickFilter),
      ]),
    [filter]
  );

  return (
    <Popover
      content={<TaskFilterForm users={users} tags={tags} projects={projects} />}
      trigger="click"
      placement="bottomRight"
    >
      {screens.sm ? (
        <Button style={style} icon={<Icons.FilterFilled />}>
          Filter Tasks {!!filterCount && `(${filterCount})`}
        </Button>
      ) : (
        <Button style={style} icon={<Icons.FilterFilled />}>
          {!!filterCount && String(filterCount)}
        </Button>
      )}
    </Popover>
  );
};

export const ProjectTaskFilterButton: FC<{
  projectId?: string;
  style?: CSSProperties;
}> = ({ projectId, style }) => {
  const { project } = useProject(projectId);
  const { users } = useOrganizationUsers(project?.organizationId);
  const tags = useProjectTaskTags(projectId);
  return <TaskFilterButton style={style} users={users} tags={tags} />;
};

export const OrganizationTaskFilterButton: FC<{
  organizationId?: string;
  style?: CSSProperties;
}> = ({ organizationId, style }) => {
  const { users } = useOrganizationUsers(organizationId);
  const tags = useOrganizationTaskTags(organizationId);
  const { organization } = useOrganizationDetails(organizationId);
  return (
    <TaskFilterButton
      style={style}
      users={users}
      tags={tags}
      projects={organization?.projects}
    />
  );
};
