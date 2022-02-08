import { Row } from "antd";
import React, { FC, ReactNode } from "react";

interface Props {
  icon: ReactNode;
  children: string;
}

export const Tab: FC<Props> = ({ icon, children }) => (
  <Row align="middle">
    {icon}
    {children}
  </Row>
);
