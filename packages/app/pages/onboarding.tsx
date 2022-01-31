import React, { useCallback, useState } from "react";
import * as Icons from "@ant-design/icons";
import { NextPage } from "next";
import {
  Avatar,
  Card,
  Col,
  Input,
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
import { useCreateOrganization } from "@dewo/app/containers/organization/hooks";
import { Constants } from "@dewo/app/util/constants";
import {
  OrganizationCreateFormSubmitButton,
  OrganizationCreateFormSubmitButtonOptions,
} from "@dewo/app/containers/organization/create/OrganizationCreateFormSubmitButton";

const Page: NextPage = () => {
  const router = useRouter();

  const createOrganizationModal = useToggle();
  const [creatingOrganization, setCreatingOrganization] = useState(false);
  const [organizationName, setOrganizationName] = useState("");

  const createOrganization = useCreateOrganization();
  const handleCreateOrganization = useCallback(
    async (options?: OrganizationCreateFormSubmitButtonOptions) => {
      setCreatingOrganization(true);
      try {
        const organization = await createOrganization({
          name: organizationName,
        });

        if (!!options?.importFromNotion) {
          const url = `${
            Constants.GRAPHQL_API_URL
          }/auth/notion?state=${JSON.stringify({
            redirect: `${organization.permalink}/notion-import`,
          })}`;
          window.location.href = url;
        } else {
          router.push(organization.permalink);
        }
      } finally {
        setCreatingOrganization(false);
      }
    },
    [createOrganization, organizationName, router]
  );

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
                    DAO core team
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
                    Contributor
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
          {/* <Typography.Title level={2}>Create your first DAO</Typography.Title> */}
          <Typography.Paragraph strong style={{ marginBottom: 0 }}>
            Create your first DAO
          </Typography.Paragraph>
          <Typography.Paragraph type="secondary">
            Create a DAO to create projects and tasks. You can also import
            boards and cards from any Notion boards you have.
          </Typography.Paragraph>
          <Input
            placeholder="Name your DAO..."
            className="ant-typography-h4"
            style={{ textAlign: "center" }}
            autoFocus
            onChange={(e) => setOrganizationName(e.target.value)}
          />
          <OrganizationCreateFormSubmitButton
            type="primary"
            block
            size="large"
            style={{ marginTop: 16 }}
            loading={creatingOrganization}
            onClick={handleCreateOrganization}
          />
        </Modal>
      </Layout.Content>
    </Layout>
  );
};

export default Page;
