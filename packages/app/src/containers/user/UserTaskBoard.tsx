import { TaskStatusEnum } from "@dewo/app/graphql/types";
import { Space } from "antd";
import React, { FC } from "react";
import { OrganizationCard } from "../landingPage/OrganizationCard";
import { useFeaturedOrganizations } from "../organization/hooks";
import { TaskBoard } from "../project/board/TaskBoard";
import { TaskSectionTitle } from "../project/board/TaskSectionTitle";
import { useUserTasks } from "./hooks";

interface Props {
  userId: string;
}

export const UserTaskBoard: FC<Props> = ({ userId }) => {
  const tasks = useUserTasks(userId, "cache-and-network");
  const organizations = useFeaturedOrganizations(3);
  if (!tasks) return null;
  return (
    <TaskBoard
      tasks={tasks}
      footer={{
        [TaskStatusEnum.TODO]: (
          <>
            {!!organizations?.length && (
              <>
                <TaskSectionTitle
                  title="Explore DAOs"
                  style={{ paddingTop: 8 }}
                />
                <Space
                  direction="vertical"
                  style={{ width: "100%", marginBottom: 8 }}
                >
                  {organizations.map((organization) => (
                    // <Card size="small">{organization.name}</Card>
                    /*
                    <Card key={organization.id} size="small">
                      <List.Item.Meta
                        avatar={
                          <OrganizationAvatar
                            organization={organization}
                            // tooltip={{ visible: false }}
                          />
                        }
                        title={
                          <Typography.Text strong>
                            {organization.name}
                          </Typography.Text>
                        }
                        description={
                          <>
                            <Typography.Paragraph
                              type="secondary"
                              ellipsis={{ rows: 3 }}
                              style={{ marginBottom: 4, lineHeight: "130%" }}
                            >
                              {organization.description}
                            </Typography.Paragraph>
                            <Row>
                              <Tag color="green">12 open bounties</Tag>
                            </Row>
                          </>
                        }
                      />
                    </Card>
                    */

                    <OrganizationCard
                      organization={organization}
                      title={{ level: 5 }}
                    />
                  ))}
                </Space>
              </>
            )}
          </>
        ),
      }}
    />
  );
};
