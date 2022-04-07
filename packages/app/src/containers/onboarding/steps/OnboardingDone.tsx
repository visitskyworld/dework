import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { useToggle } from "@dewo/app/util/hooks";
import { Avatar, Button, Card, Col, Row, Space, Typography } from "antd";
import * as Icons from "@ant-design/icons";
import Link from "next/link";
import React, { FC } from "react";
import { OrganizationCreateModal } from "../../organization/create/OrganizationCreateModal";

interface Props {
  onNext(): void;
}

export const OnboardingDone: FC<Props> = ({ onNext }) => {
  const { user } = useAuthContext();
  const createOrganization = useToggle();
  if (!user) return null;
  return (
    <>
      <Typography.Title level={2} style={{ textAlign: "center" }}>
        Done!
      </Typography.Title>
      <Typography.Paragraph
        type="secondary"
        style={{ textAlign: "center", fontSize: "130%" }}
      >
        What do you want to do next?
      </Typography.Paragraph>
      <Row
        gutter={[16, 16]}
        align="middle"
        style={{ flex: 1, marginBottom: 16 }}
      >
        <Col xs={24} sm={8}>
          <Card
            bordered={false}
            className="hover:component-highlight hover:cursor-pointer"
            onClick={createOrganization.toggleOn}
          >
            <Space
              direction="vertical"
              align="center"
              style={{ width: "100%" }}
            >
              <Avatar icon={<Icons.TeamOutlined />} size="large" />
              <Typography.Paragraph
                strong
                style={{ margin: 0, textAlign: "center" }}
              >
                Setup your first DAO
              </Typography.Paragraph>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Link href={user.permalink}>
            <Card
              bordered={false}
              style={{ flex: 1 }}
              className="hover:component-highlight hover:cursor-pointer"
            >
              <Space
                direction="vertical"
                align="center"
                style={{ width: "100%" }}
              >
                <Avatar icon={<Icons.SmileOutlined />} size="large" />
                <Typography.Paragraph
                  strong
                  style={{ margin: 0, textAlign: "center" }}
                >
                  Setup your profile
                </Typography.Paragraph>
              </Space>
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={8}>
          <Link href="/">
            <Card
              bordered={false}
              style={{ flex: 1 }}
              className="hover:component-highlight hover:cursor-pointer"
            >
              <Space
                direction="vertical"
                align="center"
                style={{ width: "100%" }}
              >
                <Avatar icon={<Icons.TrophyOutlined />} size="large" />
                <Typography.Paragraph
                  strong
                  style={{ margin: 0, textAlign: "center" }}
                >
                  Explore tasks and bounties
                </Typography.Paragraph>
              </Space>
            </Card>
          </Link>
        </Col>
      </Row>

      <Button size="large" type="primary" className="mx-auto" onClick={onNext}>
        Close
      </Button>

      <OrganizationCreateModal
        visible={createOrganization.isOn}
        onClose={createOrganization.toggleOff}
      />
    </>
  );
};
