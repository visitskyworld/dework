import React, { FC, useState } from "react";
import {
  Breadcrumb,
  PageHeader,
  Avatar,
  Button,
  Menu,
  Dropdown,
  Typography,
  Row,
  Modal,
} from "antd";
import * as Icons from "@ant-design/icons";
import { useAuthContext } from "../contexts/AuthContext";
import { Constants } from "../util/constants";

interface HeaderProps {}

export const Header: FC<HeaderProps> = () => {
  const { user, logout } = useAuthContext();
  const [showCreateOrganization, setShowCreateOrganization] = useState(false);
  return (
    <PageHeader
      title="dewo"
      // subTitle="the DAO task manager"
      avatar={{
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/BTC_Logo.svg/183px-BTC_Logo.svg.png",
      }}
      extra={[
        !user && (
          <Button key="sign-in" href="/auth">
            Sign In
          </Button>
        ),
        !!user && (
          <Dropdown
            placement="bottomRight"
            trigger={["click"]}
            overlay={
              <Menu>
                <Menu.Item
                  key="logout"
                  icon={<Icons.LogoutOutlined />}
                  onClick={logout}
                >
                  Log out
                </Menu.Item>
                <Row
                  style={{ paddingTop: 16, paddingRight: 8, paddingLeft: 8 }}
                >
                  <Typography.Text strong style={{}}>
                    Organizations
                  </Typography.Text>
                </Row>
                <Menu.Item
                  key="logout"
                  icon={
                    <Avatar
                      src={
                        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
                      }
                      size={14}
                      icon={<Icons.UserOutlined />}
                    />
                  }
                  onClick={logout}
                >
                  Dewo
                </Menu.Item>
                <Menu.Item
                  key="create-organization"
                  icon={<Icons.PlusOutlined />}
                  onClick={() => setShowCreateOrganization(true)}
                >
                  Create Organization
                </Menu.Item>
              </Menu>
            }
          >
            <Avatar
              key="avatar"
              src={user.imageUrl}
              className="pointer-cursor"
              icon={<Icons.UserOutlined />}
            />
          </Dropdown>
        ),
      ]}
    >
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="#citydao">CityDAO</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="#development">Development</a>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Modal
        title="Create Organization"
        visible={showCreateOrganization}
        onCancel={() => setShowCreateOrganization(false)}
        footer={null}
      >
        <Button
          size="large"
          type="primary"
          block
          icon={<Icons.GithubOutlined />}
          href={`${Constants.API_URL}/auth/github`}
        >
          Add from Github
        </Button>
      </Modal>
    </PageHeader>
  );
};
