import { useForm } from "antd/lib/form/Form";
import React, { FC, ReactNode, useCallback, useMemo } from "react";
import * as Icons from "@ant-design/icons";
import {
  CreateTaskViewInput,
  UpdateTaskViewInput,
  TaskViewGroupBy,
  TaskViewType,
} from "@dewo/app/graphql/types";
import { useRunningCallback } from "@dewo/app/util/hooks";
import styles from "./TaskViewForm.module.less";
import { TaskViewFormFilterList } from "./TaskViewFormFilterList";
import { TaskViewFormSortByList } from "./TaskViewFormSortByList";
import { TaskViewTypeRadioGroup } from "./TaskViewTypeRadioGroup";
import { Divider, Form, List } from "antd";
import { DebouncedInput } from "../../../../components/DebouncedInput";
import { TaskViewFormFieldList } from "./TaskViewFormFieldList";

export type FormValues = CreateTaskViewInput | UpdateTaskViewInput;

interface Props {
  initialValues?: Partial<FormValues>;
  renderFooter(info: { submitting: boolean }): ReactNode;
  onSubmit(values: FormValues): void;
  onChange?(values: FormValues): void;
  canCreate: boolean;
}

const defaultInitialValues: Omit<FormValues, "projectId"> = {
  name: "",
  type: TaskViewType.BOARD,
  filters: [],
  sortBys: [],
  groupBy: TaskViewGroupBy.status,
};

export const TaskViewForm: FC<Props> = ({
  initialValues = defaultInitialValues,
  renderFooter,
  onSubmit,
  onChange,
  canCreate,
}) => {
  const handleChange = useCallback(
    (_changed: Partial<FormValues>, values: FormValues) => onChange?.(values),
    [onChange]
  );
  const [handleSubmit, submitting] = useRunningCallback(onSubmit, [onSubmit]);

  const [form] = useForm<FormValues>();
  const footer = useMemo(
    () => renderFooter({ submitting }),
    [renderFooter, submitting]
  );

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={useMemo(
        () => ({ ...defaultInitialValues, ...initialValues }),
        [initialValues]
      )}
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
          onKeyDown={(e) => e.stopPropagation()}
        />
      </Form.Item>

      <List.Item actions={[<TaskViewTypeRadioGroup key="type" />]}>
        <List.Item.Meta avatar={<Icons.LayoutOutlined />} title="Layout" />
      </List.Item>
      <Divider />

      <TaskViewFormFilterList form={form} />
      <TaskViewFormSortByList form={form} />
      <TaskViewFormFieldList />
      {footer}
    </Form>
  );
};
