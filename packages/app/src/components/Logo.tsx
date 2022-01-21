import { Row, Typography } from "antd";
import React, { FC } from "react";
import { siteTitle } from "../util/constants";
import { DeworkIcon } from "./icons/Dework";

export const Logo: FC = () => (
  <Row align="middle">
    <DeworkIcon style={{ width: 24, height: 24, marginRight: 8 }} />
    <Typography.Title level={4} style={{ margin: 0 }}>
      {siteTitle}
    </Typography.Title>
  </Row>
);
