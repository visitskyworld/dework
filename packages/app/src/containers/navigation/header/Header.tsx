import { PageHeader, PageHeaderProps } from "antd";
import classNames from "classnames";
import React, { FC } from "react";
import styles from "./Header.module.less";
import { HeaderBreadcrumbs } from "./HeaderBreadcrumbs";

interface Props extends PageHeaderProps {}
export const Header: FC<Props> = ({ ...props }) => {
  return (
    <PageHeader
      breadcrumb={<HeaderBreadcrumbs />}
      {...props}
      className={classNames([
        props.className,
        styles.header,
        "dewo-layout-padding-vertical",
      ])}
    />
  );
};
