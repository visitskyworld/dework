import React, { FC, ReactElement, ReactNode, useMemo } from "react";
import * as Icons from "@ant-design/icons";
import { FormSection } from "@dewo/app/components/FormSection";
import { UserAvatar } from "@dewo/app/components/UserAvatar";
import { PaymentStatus, TaskDetails } from "@dewo/app/graphql/types";
import { Avatar, Button, Col, Row, Space, Tag, Typography } from "antd";
import moment from "moment";
import _ from "lodash";
import { useToggle } from "@dewo/app/util/hooks";
import { MarkdownPreview } from "@dewo/app/components/markdownEditor/MarkdownPreview";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";
import { PaymentStatusTag } from "@dewo/app/components/PaymentStatusTag";

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
              icon={
                details.isOn ? (
                  <Icons.CaretUpOutlined />
                ) : (
                  <Icons.CaretDownOutlined />
                )
              }
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
      {details.isOn && (
        <Col style={{ marginLeft: 24 + 16, opacity: 0.6, padding: 0 }}>
          {item.details}
        </Col>
      )}
    </>
  );
};

export const TaskActivityFeed: FC<Props> = ({ task }) => {
  const showSubmissions = usePermission("read", "TaskSubmission");
  const showApplications = usePermission("read", "TaskApplication");

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
              <PaymentStatusTag status={nft.payment.status} />
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
              style={{ wordBreak: "break-all" }}
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
  }, [task, showSubmissions, showApplications]);
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
