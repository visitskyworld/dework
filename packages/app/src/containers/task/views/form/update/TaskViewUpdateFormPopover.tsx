import { Button, Popover } from "antd";
import React, { FC, useCallback, useState, useMemo } from "react";
import {
  CreateTaskViewInput,
  TaskView,
  UpdateTaskViewInput,
} from "@dewo/app/graphql/types";
import { eatClick } from "@dewo/app/util/eatClick";
import { TaskViewUpdateFormFooter } from "./TaskViewUpdateFormFooter";
import { useUpdateTaskView } from "../../hooks";
import { TaskViewForm } from "../TaskViewForm";
import { useTaskViewContext } from "../../TaskViewContext";
import { ControlIcon } from "@dewo/app/components/icons/Control";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import _ from "lodash";

interface Props {
  view: TaskView;
}

export const TaskViewUpdateFormPopover: FC<Props> = ({ view }) => {
  const {
    saveButtonText,
    views,
    hasLocalChanges,
    onChangeViewLocally,
    onResetLocalChanges,
  } = useTaskViewContext();
  const updateTaskView = useUpdateTaskView();
  const handleChange = useCallback(
    (changed: UpdateTaskViewInput) => onChangeViewLocally(view.id, changed),
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
      filters: view.filters.map(({ __typename, ...f }) => f),
      sortBys: view.sortBys.map(({ __typename, ...s }) => s),
    }),
    [view]
  );

  const handleSubmit = useCallback(
    async (values: CreateTaskViewInput | UpdateTaskViewInput) => {
      await updateTaskView(
        _.omit(values, [
          "userId",
          "projectId",
          "organizationId",
        ]) as UpdateTaskViewInput
      );
      handleReset();
    },
    [updateTaskView, handleReset]
  );

  const canCreate = usePermission("create", view) ?? false;

  return (
    <Popover
      trigger={["click"]}
      style={{ minWidth: 260 }}
      content={
        <TaskViewForm
          canCreate={canCreate}
          key={resetFormKey}
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
              saveText={saveButtonText}
            />
          )}
        />
      }
    >
      <Button
        type="primary"
        size="small"
        icon={<ControlIcon style={{ margin: 0 }} />}
        onClick={eatClick}
      />
    </Popover>
  );
};
