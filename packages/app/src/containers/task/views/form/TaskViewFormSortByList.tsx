import {
  TaskViewSortByDirection,
  TaskViewSortByField,
} from "@dewo/app/graphql/types";
import {
  Button,
  Dropdown,
  Form,
  FormInstance,
  List,
  Menu,
  Row,
  Select,
} from "antd";
import React, { FC } from "react";
import * as Icons from "@ant-design/icons";
import { TaskViewFormSortByDirectionToggle } from "./TaskViewFormSortByDirectionToggle";
import { FormValues } from "./TaskViewForm";

const sortByFieldToString: Record<TaskViewSortByField, string> = {
  [TaskViewSortByField.createdAt]: "Created At",
  [TaskViewSortByField.dueDate]: "Due Date",
  [TaskViewSortByField.sortKey]: "Custom (drag-n-drop)",
};

interface Props {
  form: FormInstance<FormValues>;
}

export const TaskViewFormSortByList: FC<Props> = ({ form }) => {
  return (
    <Form.List name="sortBys">
      {(fields, { add }) => (
        <>
          <List.Item
            style={{ marginBottom: 4 }}
            actions={[
              !form.getFieldValue("sortBys").length && (
                <Dropdown
                  key="dropdown"
                  trigger={["click"]}
                  overlay={
                    <Menu>
                      {[
                        TaskViewSortByField.sortKey,
                        TaskViewSortByField.dueDate,
                        TaskViewSortByField.createdAt,
                      ].map((field) => (
                        <Menu.Item
                          key={field}
                          onClick={() =>
                            add({
                              field,
                              direction: TaskViewSortByDirection.ASC,
                            })
                          }
                        >
                          {sortByFieldToString[field]}
                        </Menu.Item>
                      ))}
                    </Menu>
                  }
                >
                  <Button size="small" type="text" className="text-secondary">
                    Sort by <Icons.RightOutlined />
                  </Button>
                </Dropdown>
              ),
            ]}
          >
            <List.Item.Meta
              avatar={<Icons.SortAscendingOutlined />}
              title="Sort by..."
            />
          </List.Item>

          {fields.map((field, index) => (
            <Row key={index} style={{ gap: 8 }}>
              <Form.Item name={[field.name, "field"]} style={{ flex: 1 }}>
                <Select placeholder="Select field...">
                  {[
                    TaskViewSortByField.sortKey,
                    TaskViewSortByField.dueDate,
                    TaskViewSortByField.createdAt,
                  ].map((type) => (
                    <Select.Option
                      key={type}
                      value={type}
                      label={sortByFieldToString[type]}
                    >
                      {sortByFieldToString[type]}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name={[field.name, "direction"]}>
                <TaskViewFormSortByDirectionToggle />
              </Form.Item>
            </Row>
          ))}
        </>
      )}
    </Form.List>
  );
};
