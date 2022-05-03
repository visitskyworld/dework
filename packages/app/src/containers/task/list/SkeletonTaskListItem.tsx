import { LoadingOutlined } from "@ant-design/icons";
import { Card } from "antd";
import React, { FC } from "react";
import styles from "./TaskListItem.module.less";

export const SkeletonTaskListItem: FC = () => (
  <Card size="small" className={styles.card} style={{ height: 50 }}>
    <LoadingOutlined />
  </Card>
);
