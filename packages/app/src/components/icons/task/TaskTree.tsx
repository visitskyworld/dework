import React, { FC } from "react";
import styles from "./TaskTree.module.less";
import LastChild from "@dewo/app/assets/last-child-branch.svg";
import Child from "@dewo/app/assets/child-branch.svg";

interface Props {
  last: boolean;
}

export const TaskTree: FC<Props> = ({ last }) => (
  <div
    className={styles.child}
    style={{ backgroundImage: `url(${last ? LastChild.src : Child.src})` }}
  />
);
