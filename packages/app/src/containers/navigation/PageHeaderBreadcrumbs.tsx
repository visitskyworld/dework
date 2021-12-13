import React, { FC } from "react";
import Link from "next/link";
import BreadCrumb, { Route } from "antd/lib/BreadCrumb/BreadCrumb";
import { Button, Row, Skeleton } from "antd";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";

const itemRender = (route: Route, _params: any, routes: any, paths: any) => {
  const last = routes.indexOf(route) === routes.length - 1;
  return last ? (
    <span>{route.breadcrumbName}</span>
  ) : (
    <Link href={["", ...paths].join("/")}>{route.breadcrumbName}</Link>
  );
};

type PageHeaderBreadcrumbsProps = {
  routes?: Route[];
};

export const PageHeaderBreadcrumbs: FC<PageHeaderBreadcrumbsProps> = ({
  routes,
}) => {
  const { user } = useAuthContext();

  return (
    <Skeleton loading={!routes} active title={false} paragraph={{ rows: 1 }}>
      <Row style={{ display: "flex", justifyContent: "space-between" }}>
        <BreadCrumb itemRender={itemRender} routes={routes} />
        {!user && (
          <Button type="primary" href="/auth">
            Sign in
          </Button>
        )}
      </Row>
    </Skeleton>
  );
};
