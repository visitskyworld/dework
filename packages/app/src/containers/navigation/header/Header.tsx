import { PageHeader, PageHeaderProps } from "antd";
import React, { FC } from "react";
import styles from "./Header.module.less";

interface Props extends PageHeaderProps {}
export const Header: FC<Props> = ({ ...props }) => {
  return <PageHeader className={styles.header} {...props} />;
};
