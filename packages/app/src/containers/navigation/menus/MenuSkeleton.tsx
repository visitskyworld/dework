import React from "react";
import { Col, Skeleton, Space } from "antd";

export const MenuSkeleton = () => {
  return (
    <>
      <Space direction="horizontal" className="w-full" style={{ padding: 16 }}>
        <Skeleton.Avatar active />
        <Col flex={1}>
          <Skeleton.Button active style={{ width: 130, minWidth: 0 }} />
        </Col>
      </Space>
      <Skeleton active style={{ paddingRight: 16, paddingLeft: 16 }} />
    </>
  );
};
