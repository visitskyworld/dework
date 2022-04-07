import React, { FC } from "react";
import Link from "next/link";
import { Row, Skeleton, Breadcrumb } from "antd";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Route } from "antd/lib/breadcrumb/Breadcrumb";
import { MobileHeader } from "./header/MobileHeader";
import { LoginButton } from "../auth/buttons/LoginButton";

const itemRender = (route: Route, _params: any, _routes: any, paths: any) => (
  <Link href={["", ...paths].join("/")}>{route.breadcrumbName}</Link>
);

interface PageHeaderBreadcrumbsProps {
  routes?: Route[];
}

export const PageHeaderBreadcrumbs: FC<PageHeaderBreadcrumbsProps> = ({
  routes,
}) => {
  const { user } = useAuthContext();
  return (
    <Skeleton loading={!routes} active title={false} paragraph={{ rows: 1 }}>
      <Row style={{ display: "flex", alignItems: "center" }}>
        {user && <MobileHeader />}

        <Row
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <Breadcrumb itemRender={itemRender} routes={routes} />
          {!user && <LoginButton type="primary">Connect</LoginButton>}
        </Row>
      </Row>
    </Skeleton>
  );
};
