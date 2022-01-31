import React, { useCallback } from "react";
import * as Icons from "@ant-design/icons";
import { NextPage } from "next";
import { Avatar, Card, Col, Layout, Modal, Row, Space, Typography } from "antd";
import { Sidebar } from "@dewo/app/containers/navigation/Sidebar";
import { useRouter } from "next/router";
import { UserOnboardingType } from "@dewo/app/graphql/types";
import { useUpdateUserOnboarding } from "@dewo/app/containers/user/hooks";
import { useToggle } from "@dewo/app/util/hooks";
import { OrganizationCreateForm } from "@dewo/app/containers/organization/create/OrganizationCreateForm";

const Page: NextPage = () => {
  const router = useRouter();
  const createOrganizationModal = useToggle();

  const updateOnboarding = useUpdateUserOnboarding();
  const handleDaoCoreTeam = useCallback(async () => {
    createOrganizationModal.toggleOn();
    await updateOnboarding({
      type: UserOnboardingType.DAO_CORE_TEAM,
    });
  }, [updateOnboarding, createOrganizationModal]);
  const handleContributor = useCallback(async () => {
    router.replace("/");
    await updateOnboarding({ type: UserOnboardingType.CONTRIBUTOR });
  }, [updateOnboarding, router]);
  return (
    <Layout>
      <Sidebar />
      <Layout.Content style={{ display: "grid", placeItems: "center" }}>
        <div className="w-full max-w-xs" style={{ textAlign: "center" }}>
          <Typography.Title level={3}>👋 Welcome to Dework</Typography.Title>
          <Typography.Paragraph>What best describes you?</Typography.Paragraph>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
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
            <Col xs={24} sm={12}>
              <Card
                style={{ flex: 1 }}
                className="hover:component-highlight hover:cursor-pointer"
                onClick={handleContributor}
              >
                <Space direction="vertical">
                  <Avatar icon={<Icons.UserAddOutlined />} size="large" />
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
          />
        </Modal>
      </Layout.Content>
    </Layout>
  );
};

export default Page;
