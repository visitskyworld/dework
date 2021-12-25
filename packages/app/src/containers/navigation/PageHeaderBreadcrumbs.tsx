import React, { FC } from "react";
import Link from "next/link";
import { Button, Row, Skeleton, Breadcrumb } from "antd";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { Route } from "antd/lib/breadcrumb/Breadcrumb";
import { MobileHeader } from "./header/MobileHeader";
import { useRouter } from "next/router";

const itemRender = (route: Route, _params: any, routes: any, paths: any) => {
  const last = routes.indexOf(route) === routes.length - 1;
  return last ? (
    <span>{route.breadcrumbName}</span>
  ) : (
    <Link href={["", ...paths].join("/")}>{route.breadcrumbName}</Link>
  );
};

interface PageHeaderBreadcrumbsProps {
  routes?: Route[];
}

export const PageHeaderBreadcrumbs: FC<PageHeaderBreadcrumbsProps> = ({
  routes,
}) => {
  const { user } = useAuthContext();
  const router = useRouter();

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
          {!user && (
            <Button type="primary" href={`/auth?redirect=${router.asPath}`}>
              Sign in
            </Button>
          )}
        </Row>
      </Row>
    </Skeleton>
  );
};
