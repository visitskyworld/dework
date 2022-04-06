import {
  GetTasksInput,
  TaskGatingType,
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
  tagLabels: string[];
  sortBy: "createdAt" | "reward";
}

const defaultFilterValues: FilterValues = {
  sortBy: "createdAt",
  tagLabels: [],
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
    !f.tagLabels.length ||
    task.tags.some((t) => f.tagLabels.includes(t.label.toLowerCase())),
  openBounties: (f) => (task) =>
    f.includeOpenBounties && task.gating === TaskGatingType.OPEN_SUBMISSION,
  applicationTasks: (f) => (task) =>
    f.includeApplicationTasks && task.gating !== TaskGatingType.OPEN_SUBMISSION,
};

export const TaskDiscoveryList: FC = () => {
  const [form] = useForm<FilterValues>();
  const [values, setValues] = useState<FilterValues>(defaultFilterValues);
  const handleChange = useCallback(
    (_changed: Partial<FilterValues>, values: FilterValues) =>
      setValues(values),
    []
  );

  const tasksQuery = useMemo(
    (): GetTasksInput => ({
      statuses: [TaskStatus.TODO],
      rewardNotNull: !values.includeTasksWithoutReward,
      userId: null,
    }),
    [values.includeTasksWithoutReward]
  );
  const _tasks = useTasks(tasksQuery);
  // hackily filter out tasks created during demos
  const tasks = useMemo(
    () =>
      _tasks?.filter((t) => {
        const name = t.project.organization.name.toLowerCase();
        return !name.includes("demo") && !name.includes("test");
      }),
    [_tasks]
  );

  const screens = useBreakpoint();
  const filters = useToggle(true);
  const tags = useMemo(
    () =>
      _.uniqBy(
        _.flatten(tasks?.map((t) => t.tags)).map((tag) => ({
          ...tag,
          label: tag.label.toLowerCase(),
        })),
        (t) => t.label
      ),
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
        {"   "}
        <Tooltip title="Only tasks in public boards and with a bounty reward show up here!">
          <Icons.QuestionCircleOutlined />
        </Tooltip>
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
                  <Form.Item label="Tags" name="tagLabels">
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
