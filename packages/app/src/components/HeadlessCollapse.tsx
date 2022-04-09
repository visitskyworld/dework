import { Collapse } from "antd";
import React, { FC, PropsWithChildren } from "react";
import styles from "./HeadlessCollapse.module.less";

interface Props {
  expanded: boolean;
}
export const HeadlessCollapse: FC<PropsWithChildren<Props>> = ({
  expanded,
  children,
}) => {
  return (
    <Collapse
      activeKey={expanded ? ["1"] : []}
      bordered={false}
      className={styles.collapse}
    >
      <Collapse.Panel header="" key="1">
        {children}
      </Collapse.Panel>
    </Collapse>
  );
};
