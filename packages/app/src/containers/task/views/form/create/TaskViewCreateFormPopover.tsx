import { Button, Popover, Typography } from "antd";
import React, { FC, useCallback } from "react";
import * as Icons from "@ant-design/icons";
import { CreateTaskViewInput } from "@dewo/app/graphql/types";
import { useCreateTaskView } from "../../hooks";
import { TaskViewForm } from "../TaskViewForm";
import { useRouter } from "next/router";
import { useTaskViewContext } from "../../TaskViewContext";
import { Tab } from "@dewo/app/components/Tab";

interface Props {
  userId?: string;
  projectId?: string;
  workspaceId?: string;
  organizationId?: string;
}

export const TaskViewCreateFormPopover: FC<Props> = ({
  userId,
  projectId,
  workspaceId,
  organizationId,
}) => {
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
          canCreate={true}
          initialValues={{ userId, projectId, workspaceId, organizationId }}
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
      <div>
        <Tab icon={<Icons.PlusOutlined />}>
          <Typography.Text className="text-secondary">Add view</Typography.Text>
        </Tab>
      </div>
    </Popover>
  );
};
