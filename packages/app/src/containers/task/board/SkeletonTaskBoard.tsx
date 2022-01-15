import { TaskStatus } from "@dewo/app/graphql/types";
import { Badge, Card, Row, Skeleton, Space } from "antd";
import React from "react";
import { STATUS_LABEL } from "../../task/board/util";
import * as Icons from "@ant-design/icons";
import * as Colors from "@ant-design/colors";
import { FC } from "react";

export const SkeletonTaskBoard: FC = () => {
  const statuses: TaskStatus[] = [
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.IN_REVIEW,
    TaskStatus.DONE,
  ];
  const taskCounts = [2, 3, 2, 4];
  const columnWidth = 300;
  const skeletonCard = (
    <div
      style={{
        marginBottom: 8,
      }}
    >
      <Card size="small">
        <Skeleton active paragraph={{ rows: 1 }} />
      </Card>
    </div>
  );

  return (
    <Row className="dewo-task-board">
      <Space size="middle" align="start">
        {statuses.map((status, i) => (
          <div key={status} style={{ width: columnWidth }}>
            <Card
              size="small"
              title={
                <Space>
                  <Badge style={{ backgroundColor: Colors.grey[6] }} showZero />
                  <span>{STATUS_LABEL[status]}</span>
                </Space>
              }
              extra={<Icons.PlusOutlined />}
              className="dewo-task-board-column"
            >
              <div style={{ paddingTop: 4 }}>
                {[...Array(taskCounts[i])].map((_) => skeletonCard)}
              </div>
            </Card>
          </div>
        ))}
      </Space>
    </Row>
  );
};
