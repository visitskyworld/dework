import React, { FC } from "react";
import Link from "next/link";
import { Breadcrumb, PageHeader, Avatar, Button, Dropdown } from "antd";
import * as Icons from "@ant-design/icons";
import { HeaderProfileDropdown } from "./HeaderProfileMenu";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { useRouter } from "next/router";
import { OrganizationBreadcrumbs } from "./OrganizationBreadcrumbs";

interface HeaderProps {}

export const Header: FC<HeaderProps> = () => {
  const { user } = useAuthContext();
  const query = useRouter().query;

  return (
    <PageHeader
      title="dewo"
      avatar={{
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/JPEG_example_subimage.svg/256px-JPEG_example_subimage.svg.png",
      }}
      extra={[
        !user && (
          <Button key="sign-in" href="/auth">
            Sign In
          </Button>
        ),
        !!user && (
          <Dropdown
            key="avatar"
            placement="bottomRight"
            overlay={<HeaderProfileDropdown />}
          >
            <Avatar
              src={user.imageUrl}
              className="pointer-cursor"
              icon={<Icons.UserOutlined />}
            />
          </Dropdown>
        ),
      ]}
    >
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link href="/">
            <a>Home</a>
          </Link>
        </Breadcrumb.Item>
        {!!query.organizationId && (
          <OrganizationBreadcrumbs
            organizationId={query.organizationId as string}
            projectId={query.projectId as string | undefined}
          />
        )}
      </Breadcrumb>
    </PageHeader>
  );
};
