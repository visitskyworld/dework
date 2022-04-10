import React, { FC, ReactElement, ReactNode, useMemo } from "react";
import * as Icons from "@ant-design/icons";
import { FormSection } from "@dewo/app/components/FormSection";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import {
  PaymentStatus,
  TaskDetails,
  TaskStatus,
} from "@dewo/app/graphql/types";
import { Avatar, Button, Col, Row, Space, Tag, Typography } from "antd";
import moment from "moment";
import _ from "lodash";
import { useToggle } from "@dewo/app/util/hooks";
import { MarkdownPreview } from "@dewo/app/components/markdownEditor/MarkdownPreview";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { PaymentStatusTag } from "@dewo/app/components/PaymentStatusTag";
import { Diff, DiffEdit } from "deep-diff";
import { HeadlessCollapse } from "@dewo/app/components/HeadlessCollapse";
import { STATUS_LABEL } from "../board/util";

interface ActivityFeedItem {
  date: string;
  avatar: ReactElement;
  text: ReactNode;
  details?: ReactNode;
}

interface Props {
  task: TaskDetails;
}

interface RowProps {
  item: ActivityFeedItem;
}

const TaskActivityFeedRow: FC<RowProps> = ({ item }) => {
  const details = useToggle();
  return (
    <>
      <Row align="middle">
        {item.avatar}
        <Typography.Text style={{ marginLeft: 16, flex: 1 }}>
          {item.text}
          {!!item.details && (
            <Button
              style={{ marginLeft: 8 }}
              icon={<Icons.CaretRightOutlined rotate={details.isOn ? 90 : 0} />}
              type="text"
              size="small"
              onClick={details.toggle}
            />
          )}
        </Typography.Text>
        <Typography.Text type="secondary" className="ant-typography-caption">
          {moment(item.date).format("lll")}
        </Typography.Text>
      </Row>
      <HeadlessCollapse expanded={details.isOn}>
        <Col style={{ marginLeft: 24 + 16, opacity: 0.6, padding: 0 }}>
          {item.details}
        </Col>
      </HeadlessCollapse>
    </>
  );
};

export const TaskActivityFeed: FC<Props> = ({ task }) => {
  const showSubmissions = usePermission("update", task, "submissions");
  const showApplications = usePermission("read", "TaskApplication");

  const statusAuditLogEvents = useMemo(
    () =>
      task.auditLog.filter(
        (l) =>
          (l.diff as Diff<any>[]).some(
            (d) => d.kind === "E" && d.path?.[0] === "status"
          ),
        [task.auditLog]
      ),
    [task.auditLog]
  );

  const items = useMemo<ActivityFeedItem[]>(() => {
    const items: ActivityFeedItem[] = [
      {
        date: task.createdAt,
        avatar: !!task.creator ? (
          <UserAvatar size="small" user={task.creator} linkToProfile />
        ) : (
          <Avatar size="small" icon={<Icons.CalendarOutlined />} />
        ),
        text: `${task.creator?.username ?? "Someone"} created this task`,
      },
      ...statusAuditLogEvents.map((event) => ({
        date: event.createdAt,
        avatar: !!event.user ? (
          <UserAvatar size="small" user={event.user} linkToProfile />
        ) : (
          <Avatar size="small" icon={<Icons.EditOutlined />} />
        ),
        text: (() => {
          const statusDiff = (event.diff as Diff<any>[]).find(
            (d): d is DiffEdit<any> =>
              d.kind === "E" && d.path?.[0] === "status"
          )!;
          return (
            <>
              {event.user?.username ?? "Someone"} changed the status to
              <Tag style={{ margin: "0 4px" }}>
                {STATUS_LABEL[statusDiff.rhs as TaskStatus]}
              </Tag>
            </>
          );
        })(),
      })),
      ...task.nfts.map((nft) => ({
        date: nft.createdAt,
        avatar: <Avatar size="small" icon={<Icons.LinkOutlined />} />,
        text: (
          <>
            On-chain proof minted
            {nft.payment.status === PaymentStatus.CONFIRMED &&
            !!nft.explorerUrl ? (
              <a
                target="_blank"
                href={nft.explorerUrl}
                rel="noreferrer"
                style={{ marginLeft: 8 }}
              >
                <Tag color="green" icon={<Icons.ExportOutlined />}>
                  View on OpenSea
                </Tag>
              </a>
            ) : (
              <PaymentStatusTag
                status={nft.payment.status}
                style={{ marginLeft: 8 }}
              />
            )}
          </>
        ),
      })),
    ];

    if (showApplications) {
      items.push(
        ...task.applications.map((a) => ({
          date: a.createdAt,
          avatar: <UserAvatar size="small" user={a.user} />,
          text: `${a.user.username} applied to this task`,
          details: (
            <>
              <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
                {moment(a.startDate).format("DD/MM/YYYY") +
                  " - " +
                  moment(a.endDate).format("DD/MM/YYYY") +
                  " (" +
                  moment
                    .duration(moment(a.endDate).diff(moment(a.startDate)))
                    .asDays() +
                  " days)"}
              </Typography.Paragraph>
              <Typography.Paragraph style={{ margin: 0 }}>
                {a.message}
              </Typography.Paragraph>
            </>
          ),
        }))
      );
    }

    if (showSubmissions) {
      items.push(
        ...task.submissions.map((submission) => ({
          date: submission.createdAt,
          avatar: <UserAvatar size="small" user={submission.user} />,
          text: `${submission.user.username} created a submission`,
          details: (
            <MarkdownPreview
              style={{ wordBreak: "break-word" }}
              value={submission.content}
            />
          ),
        }))
      );
    }

    if (!!task.doneAt) {
      items.push({
        date: task.doneAt,
        avatar: <Avatar size="small" icon={<Icons.CheckOutlined />} />,
        text: `Task completed`,
      });
    }

    return _.sortBy(items, (i) => i.date);
  }, [task, showSubmissions, showApplications, statusAuditLogEvents]);
  return (
    <FormSection label="Activity" className="mb-3">
      <Space direction="vertical" style={{ width: "100%" }}>
        {items.map((item, index) => (
          <TaskActivityFeedRow key={index} item={item} />
        ))}
      </Space>
    </FormSection>
  );
};
