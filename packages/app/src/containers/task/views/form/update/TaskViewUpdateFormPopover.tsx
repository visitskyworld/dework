import { Button, Popover } from "antd";
import React, { FC, useCallback, useState, useMemo } from "react";
import {
  TaskView,
  UpdateTaskInput,
  UpdateTaskViewInput,
} from "@dewo/app/graphql/types";
import { eatClick } from "@dewo/app/util/eatClick";
import { TaskViewUpdateFormFooter } from "./TaskViewUpdateFormFooter";
import { useUpdateTaskView } from "../../hooks";
import { TaskViewForm } from "../TaskViewForm";
import { useTaskViewContext } from "../../TaskViewContext";
import { ControlIcon } from "@dewo/app/components/icons/Control";

interface Props {
  view: TaskView;
  projectId: string;
}

export const TaskViewUpdateFormPopover: FC<Props> = ({ view, projectId }) => {
  const { views, hasLocalChanges, onChangeViewLocally, onResetLocalChanges } =
    useTaskViewContext();
  const updateTaskView = useUpdateTaskView();
  const handleChange = useCallback(
    (changed: UpdateTaskInput) => onChangeViewLocally(view.id, changed),
    [onChangeViewLocally, view.id]
  );

  const [resetFormKey, setResetFormKey] = useState<string>();
  const handleReset = useCallback(() => {
    setResetFormKey(new Date().toISOString());
    onResetLocalChanges(view.id);
  }, [view.id, onResetLocalChanges]);

  const handleDelete = useCallback(
    () => updateTaskView({ id: view.id, deletedAt: new Date().toISOString() }),
    [view.id, updateTaskView]
  );

  const initialValues = useMemo(
    () => ({
      ...view,
      projectId: undefined,
      filters: view.filters.map(({ __typename, ...f }) => f),
      sortBys: view.sortBys.map(({ __typename, ...s }) => s),
    }),
    [view]
  );

  const handleSubmit = useCallback(
    async (values: UpdateTaskViewInput) => {
      await updateTaskView(values);
      handleReset();
    },
    [updateTaskView, handleReset]
  );

  return (
    <Popover
      trigger={["click"]}
      style={{ minWidth: 260 }}
      content={
        <TaskViewForm
          key={resetFormKey}
          projectId={projectId}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onChange={handleChange}
          renderFooter={({ submitting }) => (
            <TaskViewUpdateFormFooter
              view={view}
              dirty={hasLocalChanges(view.id)}
              submitting={submitting}
              showDelete={views.length > 1}
              onReset={handleReset}
              onDelete={handleDelete}
            />
          )}
        />
      }
    >
      <Button
        type="ghost"
        size="small"
        icon={<ControlIcon style={{ margin: 0 }} />}
        onClick={eatClick}
      />
    </Popover>
  );
};
