import React, { useCallback } from "react";
import * as Icons from "@ant-design/icons";
import { NextPage } from "next";
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Layout,
  Modal,
  Row,
  Space,
  Typography,
} from "antd";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import { useRouter } from "next/router";
import { UserOnboardingType } from "@dewo/app/graphql/types";
import { useUpdateUserOnboarding } from "@dewo/app/containers/user/hooks";
import { useToggle } from "@dewo/app/util/hooks";
import { OrganizationCreateForm } from "@dewo/app/containers/organization/create/OrganizationCreateForm";
import YouTube from "react-youtube";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";

const Page: NextPage = () => {
  const router = useRouter();
  const flow = router.query.flow as "dao" | "import" | undefined;
  const { user } = useAuthContext();

  const createOrganizationModal = useToggle(["dao", "import"].includes(flow!));

  const updateOnboarding = useUpdateUserOnboarding();
  const handleDaoCoreTeam = useCallback(async () => {
    createOrganizationModal.toggleOn();
    await updateOnboarding({
      type: UserOnboardingType.DAO_CORE_TEAM,
    });
  }, [updateOnboarding, createOrganizationModal]);
  const handleContributorBounties = useCallback(async () => {
    router.replace("/");
    await updateOnboarding({ type: UserOnboardingType.CONTRIBUTOR });
  }, [updateOnboarding, router]);
  const handleContributorProfile = useCallback(async () => {
    router.replace(user!.permalink);
    await updateOnboarding({ type: UserOnboardingType.CONTRIBUTOR });
  }, [updateOnboarding, router, user]);
  return (
    <Layout>
      <Sidebar />
      <Layout.Content style={{ display: "grid", placeItems: "center" }}>
        <div className="w-full max-w-xs" style={{ textAlign: "center" }}>
          <Typography.Title level={3}>👋 Welcome to Dework</Typography.Title>
          <Typography.Paragraph style={{ fontSize: "130%" }}>
            Watch this short demo video to orient yourself:
          </Typography.Paragraph>
          <YouTube
            videoId="FT74b0dDYAU"
            opts={{ width: "100%", height: "280" }}
          />

          <Divider />
          <Typography.Paragraph style={{ fontSize: "130%" }}>
            Next, set up your account below:
          </Typography.Paragraph>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Card
                className="hover:component-highlight hover:cursor-pointer"
                onClick={handleDaoCoreTeam}
              >
                <Space direction="vertical">
                  <Avatar icon={<Icons.TeamOutlined />} size="large" />
                  <Typography.Paragraph strong style={{ margin: 0 }}>
                    Setup your first DAO
                  </Typography.Paragraph>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card
                style={{ flex: 1 }}
                className="hover:component-highlight hover:cursor-pointer"
                onClick={handleContributorProfile}
              >
                <Space direction="vertical">
                  <Avatar icon={<Icons.SmileOutlined />} size="large" />
                  <Typography.Paragraph strong style={{ margin: 0 }}>
                    Setup your profile
                  </Typography.Paragraph>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card
                style={{ flex: 1 }}
                className="hover:component-highlight hover:cursor-pointer"
                onClick={handleContributorBounties}
              >
                <Space direction="vertical">
                  <Avatar icon={<Icons.TrophyOutlined />} size="large" />
                  <Typography.Paragraph strong style={{ margin: 0 }}>
                    Explore tasks and bounties
                  </Typography.Paragraph>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
        <div />
        <Modal
          visible={createOrganizationModal.isOn}
          footer={null}
          style={{ textAlign: "center" }}
          onCancel={createOrganizationModal.toggleOff}
        >
          <Typography.Paragraph strong style={{ marginBottom: 0 }}>
            Create your first DAO
          </Typography.Paragraph>
          <Typography.Paragraph type="secondary">
            Create a DAO to create projects and tasks. You can also import
            boards and cards from any Notion boards you have.
          </Typography.Paragraph>
          <OrganizationCreateForm
            onCreated={createOrganizationModal.toggleOff}
            renderSubmitButton={(props) => {
              if (flow === "dao") {
                return <Button {...props} onClick={() => props.onClick()} />;
              } else if (flow === "import") {
                return undefined;
              }
            }}
          />
        </Modal>
      </Layout.Content>
    </Layout>
  );
};

export default Page;
