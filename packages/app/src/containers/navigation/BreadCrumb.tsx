import React, { FC } from "react";
import Link from "next/link";
import Breadcrumb, { Route } from "antd/lib/breadcrumb/Breadcrumb";
import { Skeleton } from "antd";

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

export const BreadCrumb: FC<BreadCrumbProps> = ({ routes }) =>
  !!routes ? (
    <Breadcrumb itemRender={itemRender} routes={routes} />
  ) : (
    <Skeleton loading active title={false} paragraph={{ rows: 1 }} />
  );
