import {
  Task,
  TaskGatingType,
  TaskStatus,
  TaskViewSortByDirection,
  TaskViewSortByField,
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
  Typography,
} from "antd";
import * as Icons from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";
import { CompareFn } from "antd/lib/table/interface";
import React, { FC, useCallback, useMemo, useState } from "react";
import { calculateTaskRewardAsUSD, usePaginatedTasks } from "../task/hooks";
import { TaskDiscoveryTable } from "./TaskDiscoveryTable";
import { FormSection } from "@dewo/app/components/FormSection";
import _ from "lodash";
import { TagCloudInput } from "./TagCloudInput";
import { useToggle } from "@dewo/app/util/hooks";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { QuestionmarkTooltip } from "@dewo/app/components/QuestionmarkTooltip";
import { suggestedTags } from "../../util/tags";

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

const sortBy: Record<FilterValues["sortBy"], CompareFn<Task>> = {
  createdAt: (a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  reward: (a, b) =>
    (calculateTaskRewardAsUSD(b.reward ?? undefined) ?? 0) -
    (calculateTaskRewardAsUSD(a.reward ?? undefined) ?? 0),
};

const filterFn: Record<string, (filter: FilterValues) => (t: Task) => boolean> =
  {
    tags: (f) => (task) =>
      !f.tagLabels.length ||
      task.tags.some((t) => f.tagLabels.includes(t.label.toLowerCase())),
    openBounties: (f) => (task) =>
      f.includeOpenBounties && task.gating === TaskGatingType.OPEN_SUBMISSION,
    applicationTasks: (f) => (task) =>
      f.includeApplicationTasks &&
      task.gating !== TaskGatingType.OPEN_SUBMISSION,
  };

export const TaskDiscoveryList: FC = () => {
  const [form] = useForm<FilterValues>();
  const [values, setValues] = useState<FilterValues>(defaultFilterValues);
  const handleChange = useCallback(
    (_changed: Partial<FilterValues>, values: FilterValues) =>
      setValues(values),
    []
  );

  const paginated = usePaginatedTasks(
    {
      statuses: [TaskStatus.TODO],
      hasReward: true,
      sortBy: {
        field: TaskViewSortByField.createdAt,
        direction: TaskViewSortByDirection.DESC,
      },
      assigneeIds: [null],
      parentTaskId: null,
    },
    true
  );

  const screens = useBreakpoint();
  const filters = useToggle(true);
  const tasksTags = useMemo(
    () =>
      _.uniqBy(
        _.flatten(paginated.tasks?.map((t) => t.tags)).map((tag) => ({
          ...tag,
          label: tag.label.toLowerCase(),
        })),
        (t) => t.label
      ),
    [paginated?.tasks]
  );
  const filteredAndSortedTasks = useMemo(
    () =>
      paginated?.tasks
        ?.filter(filterFn.tags(values))
        .filter((t) => !t.name.toLowerCase().includes("test"))
        .filter(
          (t) =>
            filterFn.applicationTasks(values)(t) ||
            filterFn.openBounties(values)(t)
        )
        .sort(sortBy[values.sortBy]),
    [paginated?.tasks, values]
  );

  return (
    <>
      <Typography.Title level={3} style={{ textAlign: "center", margin: 0 }}>
        🔥 Explore Bounties {!!paginated.total && `(${paginated.total})`}
        <QuestionmarkTooltip
          marginLeft={8}
          title="Only tasks in public boards and with a bounty reward show up here!"
        />
      </Typography.Title>
      <div className="mx-auto max-w-lg w-full">
        {!!paginated.tasks && !!filteredAndSortedTasks ? (
          <Row gutter={16}>
            <Col sm={24} md={8}>
              <Card
                style={{ marginTop: 16 }}
                className="bg-body-secondary"
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
                        Multiple submissions tasks
                        <QuestionmarkTooltip
                          title="Open bounties are tasks with a fixed bounty that anyone can submit work for. Submit your work on Dework and talk with the task reviewer about payout."
                          marginLeft={8}
                        />
                      </Checkbox>
                    </Form.Item>
                    <Form.Item
                      name="includeApplicationTasks"
                      valuePropName="checked"
                      style={{ margin: 0 }}
                    >
                      <Checkbox>
                        Tasks with an application process
                        <QuestionmarkTooltip
                          title="Bigger tasks usually require a short application where you share with the DAO why you should be the one to do the task. Once an application has been approved, the task will be reserved to you and cannot be claimed by someone else."
                          marginLeft={8}
                        />
                      </Checkbox>
                    </Form.Item>
                    {/* <Form.Item
                      name="includeTasksWithoutReward"
                      valuePropName="checked"
                      style={{ margin: 0 }}
                    >
                      <Checkbox>
                        Show tasks without bounties
                        <QuestionmarkTooltip
            title="DAOs don't put bounties on all tasks. That doesn't mean you won't get compensated if you do the work! Apply to tasks without bounties and talk with the task reviewer about compensation."
            marginLeft={8}
          />
                      </Checkbox>
                    </Form.Item> */}
                  </FormSection>
                  <Form.Item label="Tags" name="tagLabels">
                    <TagCloudInput
                      mainTags={suggestedTags}
                      moreTags={tasksTags}
                    />
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            <Col sm={24} md={16}>
              <TaskDiscoveryTable
                key={JSON.stringify(values)}
                tasks={filteredAndSortedTasks as TaskWithOrganization[]}
                total={
                  paginated.hasMore
                    ? paginated.total!
                    : filteredAndSortedTasks.length
                }
                loading={paginated.loading}
                onFetchMore={paginated.fetchMore}
              />
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
