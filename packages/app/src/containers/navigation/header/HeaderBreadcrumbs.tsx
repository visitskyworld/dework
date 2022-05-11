import React, { FC } from "react";
import Link from "next/link";
import { Row, Breadcrumb, Button } from "antd";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Route } from "antd/lib/breadcrumb/Breadcrumb";
import { LoginButton } from "../../auth/buttons/LoginButton";
import { useSidebarContext } from "@dewo/app/contexts/sidebarContext";
import styles from "./Header.module.less";
import { MenuOutlined } from "@ant-design/icons";

const itemRender = (route: Route, _params: any, _routes: any, paths: any) => (
  <Link href={["", ...paths].join("/")}>{route.breadcrumbName}</Link>
);

interface HeaderBreadcrumbsProps {
  routes?: Route[];
}

export const HeaderBreadcrumbs: FC<HeaderBreadcrumbsProps> = ({ routes }) => {
  const { user } = useAuthContext();
  const sidebar = useSidebarContext();
  return (
    <Row
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Button className={styles.mobileMenuButton} onClick={sidebar.toggle}>
        <MenuOutlined />
      </Button>

      <Row style={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
        <Breadcrumb itemRender={itemRender} routes={routes} />
      </Row>
      {!user && (
        <LoginButton className="dewo-header-mobile" type="primary">
          Connect
        </LoginButton>
      )}
    </Row>
  );
};
