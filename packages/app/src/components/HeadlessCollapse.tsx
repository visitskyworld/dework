import { Collapse } from "antd";
import classNames from "classnames";
import React, { FC, PropsWithChildren } from "react";
import styles from "./HeadlessCollapse.module.less";

interface Props {
  expanded: boolean;
  className?: string;
}
export const HeadlessCollapse: FC<PropsWithChildren<Props>> = ({
  expanded,
  children,
  className,
}) => {
  return (
    <Collapse
      activeKey={expanded ? ["1"] : []}
      bordered={false}
      className={classNames(styles.collapse, className)}
    >
      <Collapse.Panel header="" key="1">
        {children}
      </Collapse.Panel>
    </Collapse>
  );
};
