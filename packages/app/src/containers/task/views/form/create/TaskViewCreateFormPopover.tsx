import { Button, Popover, Space } from "antd";
import React, { FC, useCallback } from "react";
import * as Icons from "@ant-design/icons";
import { CreateTaskViewInput } from "@dewo/app/graphql/types";
import { useCreateTaskView } from "../../hooks";
import { TaskViewForm } from "../TaskViewForm";
import { useRouter } from "next/router";
import { useTaskViewContext } from "../../TaskViewContext";

interface Props {
  projectId: string;
}

export const TaskViewCreateFormPopover: FC<Props> = ({ projectId }) => {
  const { views } = useTaskViewContext();
  const router = useRouter();

  const createTaskView = useCreateTaskView();
  const handleSubmit = useCallback(
    async (values: CreateTaskViewInput) => {
      const view = await createTaskView(values);
      router.push(view.permalink);
    },
    [createTaskView, router]
  );

  return (
    <Popover
      // closes the Popover when adding a new view
      key={views.length}
      trigger={["click"]}
      content={
        <TaskViewForm
          projectId={projectId!}
          initialValues={{ projectId: projectId! }}
          onSubmit={handleSubmit}
          renderFooter={({ submitting }) => (
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={submitting}
              style={{ marginTop: 8 }}
            >
              Add View
            </Button>
          )}
        />
      }
    >
      <Space className="text-secondary">
        <Icons.PlusOutlined />
        Add view
      </Space>
    </Popover>
  );
};
