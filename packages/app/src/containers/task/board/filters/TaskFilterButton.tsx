import React, { CSSProperties, FC, useCallback, useMemo } from "react";
import * as Icons from "@ant-design/icons";
import { Button, Form, Popover } from "antd";
import { TaskTagSelectField } from "../../form/TaskTagSelectField";
import { TaskFilter, useTaskFilter } from "./FilterContext";
import { useProject } from "@dewo/app/containers/project/hooks";
import { UserSelect } from "@dewo/app/components/form/UserSelect";
import _ from "lodash";
import { useForm } from "antd/lib/form/Form";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

interface Props {
  projectId: string;
  style?: CSSProperties;
}

export const TaskFilterButton: FC<Props> = ({ projectId, style }) => {
  const [form] = useForm<TaskFilter>();
  const { filter, onChange } = useTaskFilter();
  const handleChange = useCallback(
    (_changed: Partial<TaskFilter>, values: TaskFilter) => onChange(values),
    [onChange]
  );
  const resetFilter = useCallback(() => {
    form.resetFields();
    onChange({});
  }, [form, onChange]);

  const screens = useBreakpoint();

  const filterCount = useMemo(
    () =>
      _.sum([
        filter.tagIds?.length,
        filter.assigneeIds?.length,
        filter.ownerIds?.length,
      ]),
    [filter]
  );

  const { project } = useProject(projectId);
  const users = useMemo(() => project?.members.map((m) => m.user), [project]);
  return (
    <Popover
      content={
        <Form
          form={form}
          layout="vertical"
          onValuesChange={handleChange}
          style={{ width: 320 }}
        >
          <TaskTagSelectField label="Filter by Tag" projectId={projectId} />
          <Form.Item name="assigneeIds" label="Filter by Assignee">
            <UserSelect
              mode="multiple"
              placeholder="Select assignees..."
              users={users}
            />
          </Form.Item>
          <Form.Item name="ownerIds" label="Filter by Reviewer">
            <UserSelect
              mode="multiple"
              placeholder="Select reviewers..."
              users={users}
            />
          </Form.Item>
          {!_.isEmpty(filter) && (
            <Button
              type="text"
              className="dewo-btn-highlight"
              onClick={resetFilter}
            >
              Reset Filters
            </Button>
          )}
        </Form>
      }
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
