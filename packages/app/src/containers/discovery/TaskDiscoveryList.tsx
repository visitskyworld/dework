import {
  Language,
  SearchTasksInput,
  Task,
  TaskGatingType,
  TaskStatus,
  TaskViewSortByDirection,
  TaskViewSortByField,
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
import { calculateTaskRewardAsUSD } from "../task/hooks";
import { TaskDiscoveryTable } from "./TaskDiscoveryTable";
import { FormSection } from "@dewo/app/components/FormSection";
import { SkillCloudInput } from "./SkillCloudInput";
import { useToggle } from "@dewo/app/util/hooks";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { QuestionmarkTooltip } from "@dewo/app/components/QuestionmarkTooltip";
import { useTaskViewLayoutData } from "../task/views/hooks";
import { LanguageInput } from "./LanguageInput";

interface FilterValues {
  includeOpenBounties: boolean;
  includeApplicationTasks: boolean;
  includeTasksWithoutReward: boolean;
  skillIds: string[];
  languages: Language[];
  sortBy: "createdAt" | "reward";
}

const defaultFilterValues: FilterValues = {
  sortBy: "createdAt",
  skillIds: [],
  languages: [],
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

  const [data, featured] = useTaskViewLayoutData(
    useMemo<SearchTasksInput[]>(
      () => [
        {
          statuses: [TaskStatus.TODO],
          hasReward: true,
          featured: false,
          sortBy: {
            field: TaskViewSortByField.createdAt,
            direction: TaskViewSortByDirection.DESC,
          },
          skillIds: !!values.skillIds.length ? values.skillIds : undefined,
          languages: !!values.languages.length ? values.languages : undefined,
          assigneeIds: [null],
          parentTaskId: null,
        },
        {
          statuses: [TaskStatus.TODO],
          featured: true,
          sortBy: {
            field: TaskViewSortByField.createdAt,
            direction: TaskViewSortByDirection.DESC,
          },
          skillIds: !!values.skillIds.length ? values.skillIds : undefined,
          languages: !!values.languages.length ? values.languages : undefined,
          assigneeIds: [null],
          parentTaskId: null,
        },
      ],
      [values.skillIds, values.languages]
    ),
    {
      withOrganization: true,
      sort: sortBy[values.sortBy],
      filter: (t) =>
        filterFn.applicationTasks(values)(t) ||
        filterFn.openBounties(values)(t),
    }
  );

  const screens = useBreakpoint();
  const filters = useToggle(true);
  return (
    <>
      <div className="mx-auto max-w-lg w-full">
        <Row gutter={16} justify="center">
          <Col md={8}></Col>
          <Col md={16}>
            <Typography.Title level={3}>Explore Bounties</Typography.Title>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col sm={24} md={8}>
            <Card
              style={{ marginTop: 0 }}
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
                </FormSection>
                <FormSection label="Skills">
                  <Typography.Paragraph
                    type="secondary"
                    className="ant-typography-caption"
                  >
                    Click on skills to show tasks for
                  </Typography.Paragraph>
                  <Form.Item name="skillIds">
                    <SkillCloudInput />
                  </Form.Item>
                </FormSection>
                <FormSection label="Languages">
                  <Form.Item name="languages">
                    <LanguageInput />
                  </Form.Item>
                </FormSection>
              </Form>
            </Card>
          </Col>
          <Col sm={24} md={16}>
            {!!featured.tasks?.length && (
              <>
                <Typography.Title
                  style={{ textTransform: "uppercase", margin: 0 }}
                  level={5}
                >
                  🔥 <span className="text-primary">Featured</span>
                  <QuestionmarkTooltip
                    marginLeft={8}
                    title={
                      <Typography.Text style={{ whiteSpace: "pre-line" }}>
                        High-quality bounties are marked as 'featured', which
                        means that they:{"\n"}
                        <ol>
                          <li>
                            Have a bounty in a token listed on Coinmarketcap, so
                            that the dollar-value can be known
                          </li>
                          <li>Have a clear description</li>
                          <li>
                            The project is connected to Discord, so you easily
                            can talk with the applicant
                          </li>
                        </ol>
                      </Typography.Text>
                    }
                  />
                </Typography.Title>
                <TaskDiscoveryTable
                  key={"featured-" + JSON.stringify(values)}
                  data={featured}
                />
              </>
            )}
            <Typography.Title
              style={{ textTransform: "uppercase", margin: 0 }}
              level={5}
            >
              All Bounties
            </Typography.Title>
            {!!data.tasks ? (
              <TaskDiscoveryTable key={JSON.stringify(values)} data={data} />
            ) : (
              <div style={{ display: "grid" }}>
                <Spin />
              </div>
            )}
          </Col>
        </Row>
      </div>
    </>
  );
};
