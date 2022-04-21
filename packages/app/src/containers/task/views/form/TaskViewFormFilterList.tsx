import {
  TaskViewFilterInput,
  TaskViewFilterType,
} from "@dewo/app/graphql/types";
import { Button, Dropdown, Form, FormInstance, List, Menu } from "antd";
import React, { FC } from "react";
import * as Icons from "@ant-design/icons";
import { TaskViewFormFilterRow } from "./TaskViewFormFilterRow";
import { FormValues } from "./TaskViewForm";

const taskViewFilterTypeToString: Record<TaskViewFilterType, string> = {
  [TaskViewFilterType.STATUSES]: "Status",
  [TaskViewFilterType.TAGS]: "Tags",
  [TaskViewFilterType.ASSIGNEES]: "Assignees",
  [TaskViewFilterType.OWNERS]: "Reviewer",
  [TaskViewFilterType.ROLES]: "Roles",
};

interface Props {
  form: FormInstance<FormValues>;
  projectId: string;
}

export const TaskViewFormFilterList: FC<Props> = ({ form, projectId }) => (
  <Form.List name="filters">
    {(fields, { add, remove }) => (
      <>
        <List.Item
          style={{ marginBottom: 4 }}
          actions={[
            <Dropdown
              key="dropdown"
              trigger={["click"]}
              overlay={
                <Menu>
                  {[
                    TaskViewFilterType.STATUSES,
                    TaskViewFilterType.TAGS,
                    TaskViewFilterType.ASSIGNEES,
                    // TaskViewFilterType.OWNERS,
                    TaskViewFilterType.ROLES,
                  ]
                    .filter(
                      (type) =>
                        !form
                          .getFieldValue("filters")
                          .some((f: TaskViewFilterInput) => f.type === type)
                    )
                    .map((type) => (
                      <Menu.Item key={type} onClick={() => add({ type })}>
                        {taskViewFilterTypeToString[type]}
                      </Menu.Item>
                    ))}
                </Menu>
              }
            >
              <Button size="small" type="text" className="text-secondary">
                Add filter <Icons.RightOutlined />
              </Button>
            </Dropdown>,
          ]}
        >
          <List.Item.Meta avatar={<Icons.FilterFilled />} title="Filter" />
        </List.Item>

        {fields.map((field, index) => (
          <TaskViewFormFilterRow
            name={field.name}
            type={form.getFieldValue(["filters", field.name, "type"])}
            projectId={projectId}
            // when pressing onClear and removing the item sync, Ant form will
            // also save the cleared value, creating a filter without a type
            onClear={() => requestAnimationFrame(() => remove(index))}
          />
        ))}
      </>
    )}
  </Form.List>
);
