import { Badge, Button, Row, Typography } from "antd";
import React, { FC, ReactNode } from "react";
import * as Icons from "@ant-design/icons";
import { Can } from "@dewo/app/contexts/PermissionsContext";
import { TaskStatus } from "@dewo/app/graphql/types";
import { STATUS_LABEL } from "../../task/board/util";
import Link from "next/link";
import { useProject } from "../../project/hooks";
import { TaskStatusIcon } from "@dewo/app/components/icons/task/TaskStatus";

interface Props {
  status: TaskStatus;
  showIcon?: boolean;
  count: number;
  collapse?: {
    collapsed: boolean;
    onToggle(collapsed: boolean): void;
  };
}

export const TaskViewGroupHeader: FC<Props> = ({
  status,
  showIcon,
  count,
  collapse,
}) => {
  return (
    <Row align="middle" style={{ gap: 8 }}>
      {showIcon && <TaskStatusIcon size={16} status={status} />}
      <Typography.Text style={{ margin: 0, fontWeight: 500 }}>
        {STATUS_LABEL[status]}
      </Typography.Text>
      <Badge count={count} showZero />
      {!!collapse && (
        <Button
          type="text"
          size="small"
          className="text-secondary font-bold ant-typography-caption"
          onClick={() => collapse.onToggle(!collapse.collapsed)}
        >
          {collapse.collapsed ? (
            <Icons.CaretUpOutlined />
          ) : (
            <Icons.CaretDownOutlined />
          )}
        </Button>
      )}
    </Row>
  );
};

interface ExtraProps {
  status: TaskStatus;
  extra?: ReactNode;
  projectId?: string;
}

export const TaskViewGroupHeaderExtra: FC<ExtraProps> = ({
  status,
  projectId,
  extra,
}) => {
  const { project } = useProject(projectId);
  return (
    <>
      {extra}
      {!!project && (
        <Can
          I="create"
          this={{
            __typename: "Task",
            status,
            projectId,
            // @ts-ignore
            ...{ ownerIds: [] },
          }}
        >
          <Link
            href={`${project.permalink}/create?values=${encodeURIComponent(
              JSON.stringify({ status })
            )}`}
          >
            <Button type="text" icon={<Icons.PlusOutlined />} />
          </Link>
        </Can>
      )}
    </>
  );
};
