import { Form, Input } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { FC, ReactNode, useCallback, useMemo } from "react";
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
import { Can } from "@dewo/app/contexts/PermissionsContext";

export type FormValues = CreateTaskViewInput | UpdateTaskViewInput;

interface Props {
  projectId: string;
  initialValues?: Partial<FormValues>;
  renderFooter(info: { submitting: boolean }): ReactNode;
  onSubmit(values: FormValues): void;
  onChange?(values: FormValues): void;
}

const defaultInitialValues: Omit<FormValues, "projectId"> = {
  name: "",
  type: TaskViewType.BOARD,
  filters: [],
  sortBys: [],
  groupBy: TaskViewGroupBy.status,
};

export const TaskViewForm: FC<Props> = ({
  projectId,
  initialValues = defaultInitialValues,
  renderFooter,
  onSubmit,
  onChange,
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
      <Form.Item name="type" hidden />
      <Form.Item name="sortBys" hidden />

      <Can I="create" this={{ __typename: "TaskView", projectId }}>
        <Form.Item
          name="name"
          rules={[{ required: true, min: 1, message: "Please name this view" }]}
        >
          <Input
            placeholder="View name"
            autoComplete="off"
            // https://github.com/ant-design/ant-design/issues/15610#issuecomment-475951448
            onKeyDown={(e) => e.stopPropagation()}
          />
        </Form.Item>
      </Can>

      {/* <List.Item actions={[<TaskViewTypeRadioGroup key="type" />]}>
        <List.Item.Meta avatar={<Icons.LayoutOutlined />} title="Layout" />
      </List.Item>
      <Divider /> */}

      <TaskViewFormFilterList form={form} projectId={projectId} />
      <TaskViewFormSortByList form={form} />
      {footer}
    </Form>
  );
};
