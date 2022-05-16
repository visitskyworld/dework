import { useForm } from "antd/lib/form/Form";
import React, { FC, ReactNode, useCallback, useMemo } from "react";
import * as Icons from "@ant-design/icons";
import {
  CreateTaskViewInput,
  UpdateTaskViewInput,
  TaskViewGroupBy,
  TaskViewType,
  TaskViewFilterType,
} from "@dewo/app/graphql/types";
import { useRunning } from "@dewo/app/util/hooks";
import styles from "./TaskViewForm.module.less";
import { TaskViewFormFilterList } from "./TaskViewFormFilterList";
import { TaskViewFormSortByList } from "./TaskViewFormSortByList";
import { TaskViewTypeRadioGroup } from "./TaskViewTypeRadioGroup";
import { Divider, Form, List } from "antd";
import { DebouncedInput } from "../../../../components/DebouncedInput";
import { TaskViewFormFieldList } from "./TaskViewFormFieldList";
import { stopPropagation } from "@dewo/app/util/eatClick";
import { IncludeSubtasksRow } from "./IncludeSubtasksRow";
import _ from "lodash";

type OutputValue = CreateTaskViewInput | UpdateTaskViewInput;

export type FormValues = OutputValue & {
  includeSubtasks: boolean;
};

interface Props {
  initialValues?: Partial<FormValues>;
  renderFooter(info: { submitting: boolean }): ReactNode;
  onSubmit(values: OutputValue): Promise<void>;
  onChange?(values: OutputValue): void;
  canCreate: boolean;
}

const defaultInitialValues: Omit<FormValues, "projectId"> = {
  name: "",
  type: TaskViewType.BOARD,
  filters: [],
  sortBys: [],
  groupBy: TaskViewGroupBy.status,
  includeSubtasks: false,
};

const toOutputValue = (values: FormValues): OutputValue => ({
  ...(_.omit(values, "includeSubtasks") as OutputValue),
  filters: [
    ...(values.filters ?? []).filter(
      (f) => f.type !== TaskViewFilterType.SUBTASKS
    ),
    { type: TaskViewFilterType.SUBTASKS, subtasks: values.includeSubtasks },
  ],
});

export const TaskViewForm: FC<Props> = ({
  initialValues: initialValuesOverride = defaultInitialValues,
  renderFooter,
  onSubmit,
  onChange,
  canCreate,
}) => {
  const handleChange = useCallback(
    (_changed: Partial<FormValues>, values: FormValues) =>
      onChange?.(toOutputValue(values)),
    [onChange]
  );
  const [handleSubmit, submitting] = useRunning(
    useCallback(
      (values: FormValues) => onSubmit(toOutputValue(values)),
      [onSubmit]
    )
  );

  const [form] = useForm<FormValues>();
  const footer = useMemo(
    () => renderFooter({ submitting }),
    [renderFooter, submitting]
  );

  const initialValues = useMemo(
    () => ({
      ...defaultInitialValues,
      ...initialValuesOverride,
      includeSubtasks: !!initialValuesOverride.filters?.find(
        (f) => f.type === TaskViewFilterType.SUBTASKS
      )?.subtasks,
    }),
    [initialValuesOverride]
  );

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={initialValues}
      className={styles.form}
      style={{ width: 320 }}
      onFinish={handleSubmit}
      onValuesChange={handleChange}
    >
      <Form.Item name="id" hidden />
      <Form.Item name="projectId" hidden />
      <Form.Item name="userId" hidden />
      <Form.Item name="organizationId" hidden />

      <Form.Item
        hidden={!canCreate}
        name="name"
        rules={[{ required: true, min: 1, message: "Please name this view" }]}
      >
        <DebouncedInput
          placeholder="View name"
          autoComplete="off"
          // https://github.com/ant-design/ant-design/issues/15610#issuecomment-475951448
          onKeyDown={stopPropagation}
        />
      </Form.Item>

      <List.Item actions={[<TaskViewTypeRadioGroup key="type" />]}>
        <List.Item.Meta avatar={<Icons.LayoutOutlined />} title="Layout" />
      </List.Item>
      <Divider />

      <TaskViewFormFilterList form={form} />
      <TaskViewFormSortByList form={form} />
      <TaskViewFormFieldList />
      {(form.getFieldValue("type") ?? initialValues.type) ===
        TaskViewType.LIST && <IncludeSubtasksRow />}
      {footer}
    </Form>
  );
};
