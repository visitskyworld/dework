import React, { FC } from "react";
import { TaskStatus } from "@dewo/app/graphql/types";
import * as Icons from "@ant-design/icons";
import { TaskBoard } from "../task/board/TaskBoard";
import { useUserTasks } from "./hooks";
import { TaskBoardColumnEmptyProps } from "../task/board/TaskBoardColumnEmtpy";
import { SkeletonTaskBoard } from "../task/board/SkeletonTaskBoard";

interface Props {
  userId: string;
}

const empty: Partial<Record<TaskStatus, TaskBoardColumnEmptyProps>> = {
  [TaskStatus.TODO]: {
    title: "First apply to tasks, then the ones assigned to you appear here",
    icon: <Icons.UsergroupAddOutlined />,
  },
  [TaskStatus.IN_PROGRESS]: {
    title: "Here drag in all tasks that you have in progress here",
    icon: <Icons.ThunderboltOutlined />,
  },
  [TaskStatus.IN_REVIEW]: {
    title: "When you're done with a task, put it here for review by the DAO",
    icon: <Icons.SafetyOutlined />,
  },
  [TaskStatus.DONE]: {
    title: "Keep track of your completed tasks and reward payment here",
    icon: <Icons.DollarCircleOutlined />,
  },
};

export const UserTaskBoard: FC<Props> = ({ userId }) => {
  const tasks = useUserTasks(userId, "cache-and-network");
  // const organizations = useFeaturedOrganizations(3);
  // const latestTasks = useTasks(
  //   useMemo(
  //     () => ({
  //       statuses: [TaskStatus.TODO],
  //       limit: 100,
  //       organizationIds: organizations?.map((o) => o.id),
  //     }),
  //     [organizations]
  //   ),
  //   !organizations
  // );

  return tasks ? (
    <TaskBoard
      tasks={tasks}
      empty={empty}
      // footer={{
      //   [TaskStatus.TODO]: (
      //     <Row gutter={[8, 8]}>
      //       {!!organizations?.length && (
      //         <Col span={24}>
      //           <TaskSectionTitle title="Explore DAOs" />
      //           <Space
      //             direction="vertical"
      //             style={{ width: "100%", marginBottom: 8 }}
      //           >
      //             {organizations.map((organization) => (
      //               <OrganizationCard
      //                 key={organization.id}
      //                 organization={organization}
      //                 title={{ level: 5 }}
      //               />
      //             ))}
      //             <CreateOrganizationButton
      //               block
      //               type="text"
      //               style={{
      //                 height: "unset",
      //                 margin: "0 auto",
      //                 textAlign: "left",
      //                 padding: 0,
      //               }}
      //             >
      //               <Card size="small">
      //                 <List.Item.Meta
      //                   avatar={
      //                     <Avatar>
      //                       <Icons.PlusOutlined />
      //                     </Avatar>
      //                   }
      //                   title="Set up your own DAO"
      //                 />
      //               </Card>
      //             </CreateOrganizationButton>
      //           </Space>
      //         </Col>
      //       )}
      //       {!!latestTasks?.length && (
      //         <Col span={24}>
      //           <TaskSectionTitle title="Apply to new tasks" />
      //           <Space
      //             direction="vertical"
      //             style={{ width: "100%", marginBottom: 8 }}
      //           >
      //             {latestTasks.map((task) => (
      //               <TaskCard
      //                 key={task.id}
      //                 task={task}
      //                 style={{ cursor: "pointer" }}
      //               />
      //             ))}
      //           </Space>
      //         </Col>
      //       )}
      //     </Row>
      //   ),
      // }}
    />
  ) : (
    <SkeletonTaskBoard />
  );
};
