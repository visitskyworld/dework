import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { useRunningCallback, useToggle } from "@dewo/app/util/hooks";
import { Avatar, Button, Col, Row, Typography } from "antd";
import * as Icons from "@ant-design/icons";
import Link from "next/link";
import React, { FC } from "react";
import { OrganizationCreateModal } from "../../organization/create/OrganizationCreateModal";
import styles from "./OnboardingDone.module.less";

interface Props {
  onNext(): void;
}

export const OnboardingDone: FC<Props> = ({ onNext }) => {
  const { user } = useAuthContext();
  const createOrganization = useToggle();
  const [handleNext, loadingNext] = useRunningCallback(onNext, [onNext]);
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
          <Button
            block
            className={styles.tile}
            name="Onboarding Done: create DAO"
            onClick={createOrganization.toggleOn}
          >
            <Avatar icon={<Icons.TeamOutlined />} size="large" />
            <Typography.Paragraph
              strong
              style={{ margin: 0, textAlign: "center" }}
            >
              Setup your first DAO
            </Typography.Paragraph>
          </Button>
        </Col>
        <Col xs={24} sm={8}>
          <Link href={user.permalink}>
            <Button
              block
              className={styles.tile}
              name="Onboarding Done: setup profile"
            >
              <Avatar icon={<Icons.SmileOutlined />} size="large" />
              <Typography.Paragraph
                strong
                style={{ margin: 0, textAlign: "center" }}
              >
                Setup your profile
              </Typography.Paragraph>
            </Button>
          </Link>
        </Col>
        <Col xs={24} sm={8}>
          <Link href="/">
            <Button
              block
              className={styles.tile}
              name="Onboarding Done: explore tasks and bounties"
            >
              <Avatar icon={<Icons.TrophyOutlined />} size="large" />
              <Typography.Paragraph
                strong
                style={{ margin: 0, textAlign: "center" }}
              >
                Explore tasks and bounties
              </Typography.Paragraph>
            </Button>
          </Link>
        </Col>
      </Row>

      <Button
        size="large"
        type="primary"
        className="mx-auto"
        loading={loadingNext}
        name="Onboarding Done: close"
        onClick={handleNext}
      >
        Close
      </Button>

      <OrganizationCreateModal
        visible={createOrganization.isOn}
        onClose={createOrganization.toggleOff}
      />
    </>
  );
};
