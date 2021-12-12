import React, { FC } from "react";
import Link from "next/link";
import Breadcrumb, { Route } from "antd/lib/breadcrumb/Breadcrumb";
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

type BreadCrumbProps = {
  routes?: Route[];
};

export const BreadCrumb: FC<BreadCrumbProps> = ({ routes }) => {
  const { user } = useAuthContext();

  return !!routes ? (
    <Row style={{ display: "flex", justifyContent: "space-between" }}>
      <Breadcrumb itemRender={itemRender} routes={routes} />
      {!user && (
        <Button type="primary" href="/auth">
          Sign in
        </Button>
      )}
    </Row>
  ) : (
    <Skeleton loading active title={false} paragraph={{ rows: 1 }} />
  );
};
