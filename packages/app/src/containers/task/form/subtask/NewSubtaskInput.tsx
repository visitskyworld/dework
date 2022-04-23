import React, { FC, useCallback, useRef, useState } from "react";
import { useToggle } from "@dewo/app/util/hooks";
import { Button, Col, Form, Input, InputRef, Row, Typography } from "antd";
import * as Icons from "@ant-design/icons";
import { eatClick } from "@dewo/app/util/eatClick";
import { HeadlessCollapse } from "@dewo/app/components/HeadlessCollapse";
import { SubtaskFormValues } from "./SubtaskInput";
import style from "./NewSubtaskInput.module.less";

interface NewSubtaskProps {
  disabled?: boolean;
  onSubmit: (subtask: SubtaskFormValues) => void;
  onCancel?: () => void;
  hideButton?: boolean;
  placeholder?: string;
  initialValues?: Partial<SubtaskFormValues>;
  autoFocus?: boolean;
}
export const NewSubtaskInput: FC<NewSubtaskProps> = ({
  onSubmit,
  onCancel,
  disabled,
  hideButton,
  placeholder = "Add a subtask",
  initialValues = {},
  autoFocus,
}) => {
  const subTaskInputRef = useRef<InputRef>(null);
  const focusInput = useCallback(
    () => subTaskInputRef.current?.focus(),
    [subTaskInputRef]
  );

  const [form] = Form.useForm<SubtaskFormValues>();
  const [values, setValues] = useState(initialValues);
  const handleChange = useCallback(
    (
      _changed: Partial<SubtaskFormValues>,
      values: Partial<SubtaskFormValues>
    ) => setValues(values),
    []
  );

  const isInitialized = useToggle(false);

  const reset = useCallback(() => {
    isInitialized.toggleOff();
    setValues(initialValues);
    form.resetFields();
    onCancel?.();
  }, [form, initialValues, isInitialized, onCancel]);

  const handleAddTask = useCallback(async () => {
    if (!values.name) return;
    await onSubmit(values as SubtaskFormValues);
    reset();
  }, [values, onSubmit, reset]);

  const handleSubmit = useCallback(
    (e: React.SyntheticEvent) => {
      eatClick(e);
      handleAddTask();
    },
    [handleAddTask]
  );

  return (
    <Form
      initialValues={initialValues}
      onValuesChange={handleChange}
      form={form}
      onFinish={handleAddTask}
    >
      <Row
        align="top"
        className={[!!isInitialized.isOn && style.activeCard, style.card].join(
          " "
        )}
      >
        <Col hidden={hideButton}>
          <Button
            icon={<Icons.PlusOutlined />}
            shape="circle"
            size="small"
            type="ghost"
            onClick={values.name ? handleSubmit : focusInput}
            style={{ marginTop: 4 }}
          />
        </Col>
        <Col flex={1} style={{ width: "unset" }}>
          <Form.Item name="name" style={{ marginBottom: 0 }}>
            <Input
              autoComplete="off"
              onFocus={isInitialized.toggleOn}
              bordered={false}
              ref={subTaskInputRef}
              style={{ flex: 1, fontWeight: 500 }}
              placeholder={placeholder}
              disabled={disabled}
              onPressEnter={handleSubmit}
              autoFocus={autoFocus}
            />
          </Form.Item>
          <HeadlessCollapse expanded={isInitialized.isOn}>
            <Form.Item name="description">
              <Input.TextArea
                bordered={false}
                placeholder="Add a description"
              />
            </Form.Item>
            <Row justify="end">
              <Button
                size="small"
                type="text"
                style={{ marginRight: 8 }}
                onClick={reset}
              >
                <Typography.Text type="secondary">Cancel</Typography.Text>
              </Button>
              <Button
                size="small"
                type="primary"
                loading={disabled}
                disabled={disabled}
                onClick={form.submit}
              >
                Save
              </Button>
            </Row>
          </HeadlessCollapse>
        </Col>
      </Row>
    </Form>
  );
};
