import {
  GetTasksInput,
  TaskStatus,
  TaskWithOrganization,
} from "@dewo/app/graphql/types";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Row,
  Select,
  Spin,
  Tooltip,
  Typography,
} from "antd";
import * as Icons from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";
import { CompareFn } from "antd/lib/table/interface";
import React, { FC, useCallback, useMemo, useState } from "react";
import { calculateTaskRewardAsUSD, useTasks } from "../task/hooks";
import { TaskDiscoveryTable } from "./TaskDiscoveryTable";
import { FormSection } from "@dewo/app/components/FormSection";
import _ from "lodash";
import { TagCloudInput } from "./TagCloudInput";
import { useToggle } from "@dewo/app/util/hooks";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

interface FilterValues {
  includeOpenBounties: boolean;
  includeApplicationTasks: boolean;
  includeTasksWithoutReward: boolean;
  tagIds: string[];
  sortBy: "createdAt" | "reward";
}

const defaultFilterValues: FilterValues = {
  sortBy: "createdAt",
  tagIds: [],
  includeOpenBounties: true,
  includeApplicationTasks: true,
  includeTasksWithoutReward: false,
};

const sortBy: Record<
  FilterValues["sortBy"],
  CompareFn<TaskWithOrganization>
> = {
  createdAt: (a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  reward: (a, b) =>
    (calculateTaskRewardAsUSD(b.reward ?? undefined) ?? 0) -
    (calculateTaskRewardAsUSD(a.reward ?? undefined) ?? 0),
};

const filterFn: Record<
  string,
  (filter: FilterValues) => (t: TaskWithOrganization) => boolean
> = {
  tags: (f) => (task) =>
    !f.tagIds.length || task.tags.some((t) => f.tagIds.includes(t.id)),
  openBounties: (f) => (task) =>
    f.includeOpenBounties && !!task.options?.allowOpenSubmission,
  applicationTasks: (f) => (task) =>
    f.includeApplicationTasks && !task.options?.allowOpenSubmission,
};

export const TaskDiscoveryList: FC = () => {
  const [form] = useForm<FilterValues>();
  const [values, setValues] = useState<FilterValues>(defaultFilterValues);
  const handleChange = useCallback(
    (_changed: Partial<FilterValues>, values: FilterValues) =>
      setValues(values),
    []
  );

  const tasksQuery = useMemo<GetTasksInput>(
    () => ({
      statuses: [TaskStatus.TODO],
      rewardNotNull: !values.includeTasksWithoutReward,
      assigneeId: null,
    }),
    [values.includeTasksWithoutReward]
  );
  const tasks = useTasks(tasksQuery);

  const screens = useBreakpoint();
  const filters = useToggle(true);
  const tags = useMemo(
    () =>
      _(tasks)
        .map((t) => t.tags)
        .flatten()
        .uniqBy((t) => t.id)
        .value(),
    [tasks]
  );
  const filteredAndSortedTasks = useMemo(
    () =>
      tasks
        ?.filter(filterFn.tags(values))
        .filter(
          (t) =>
            filterFn.applicationTasks(values)(t) ||
            filterFn.openBounties(values)(t)
        )
        .sort(sortBy[values.sortBy]),
    [tasks, values]
  );

  return (
    <>
      <Typography.Title level={3} style={{ textAlign: "center", margin: 0 }}>
        🔥 Explore Bounties {!!tasks && `(${tasks.length})`}
      </Typography.Title>
      <div className="mx-auto max-w-lg w-full">
        {!!filteredAndSortedTasks ? (
          <Row gutter={16}>
            <Col sm={24} md={8}>
              <Card
                style={{ marginTop: 16 }}
                size="small"
                title="Filter bounties"
                extra={
                  !screens.sm && (
                    <Button
                      type="text"
                      icon={
                        filters.isOn ? (
                          <Icons.EyeInvisibleOutlined
                            onClick={filters.toggleOff}
                          />
                        ) : (
                          <Icons.EyeOutlined onClick={filters.toggleOn} />
                        )
                      }
                    />
                  )
                }
              >
                <Form
                  form={form}
                  initialValues={defaultFilterValues}
                  layout="vertical"
                  style={filters.isOn ? {} : { display: "none" }}
                  onValuesChange={handleChange}
                >
                  <Form.Item label="Sorting" name="sortBy">
                    <Select>
                      <Select.Option value="createdAt">
                        Creation date (newest first)
                      </Select.Option>
                      <Select.Option value="reward">
                        Bounty size (highest)
                      </Select.Option>
                    </Select>
                  </Form.Item>
                  <FormSection label="Task type">
                    <Form.Item
                      name="includeOpenBounties"
                      valuePropName="checked"
                      style={{ margin: 0 }}
                    >
                      <Checkbox>
                        Show tasks where anyone can submit{"    "}
                        <Tooltip title="Open bounties are tasks with a fixed bounty that anyone can submit work for. Submit your work on Dework and talk with the task reviewer about payout.">
                          <Icons.QuestionCircleOutlined />
                        </Tooltip>
                      </Checkbox>
                    </Form.Item>
                    <Form.Item
                      name="includeApplicationTasks"
                      valuePropName="checked"
                      style={{ margin: 0 }}
                    >
                      <Checkbox>
                        Show tasks that can be reserved{"    "}
                        <Tooltip title="Bigger tasks usually require a short application where you share with the DAO why you should be the one to do the task. Once an application has been approved, the task will be reserved to you and cannot be claimed by someone else.">
                          <Icons.QuestionCircleOutlined />
                        </Tooltip>
                      </Checkbox>
                    </Form.Item>
                    {/* <Form.Item
                      name="includeTasksWithoutReward"
                      valuePropName="checked"
                      style={{ margin: 0 }}
                    >
                      <Checkbox>
                        Show tasks without bounties{"    "}
                        <Tooltip title="DAOs don't put bounties on all tasks. That doesn't mean you won't get compensated if you do the work! Apply to tasks without bounties and talk with the task reviewer about compensation.">
                          <Icons.QuestionCircleOutlined />
                        </Tooltip>
                      </Checkbox>
                    </Form.Item> */}
                  </FormSection>
                  <Form.Item label="Tags" name="tagIds">
                    <TagCloudInput tags={tags} />
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            <Col sm={24} md={16}>
              <TaskDiscoveryTable tasks={filteredAndSortedTasks} />
            </Col>
          </Row>
        ) : (
          <div style={{ display: "grid" }}>
            <Spin />
          </div>
        )}
      </div>
    </>
  );
};
