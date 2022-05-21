import React, { FC, ReactNode } from "react";
import { Button, Col, Row, Typography } from "antd";
import Link from "next/link";
import * as Icons from "@ant-design/icons";
import { useSidebarContext } from "@dewo/app/contexts/sidebarContext";

export const MenuHeader: FC<{
  href: string;
  icon: ReactNode | null;
  title: string;
}> = ({ href, icon, title }) => {
  const { toggle, isOn } = useSidebarContext();
  return (
    <Row style={{ padding: 16 }} wrap={false} className="w-full">
      <Col flex={1} style={{ overflow: "hidden" }}>
        <Link href={href}>
          <a>
            <Row
              align="middle"
              wrap={false}
              className="w-full"
              style={{ flex: 1 }}
            >
              <div style={{ flex: 0, paddingRight: 8 }}>{icon}</div>
              <Typography.Title
                ellipsis
                style={{
                  margin: 0,
                  fontWeight: 500,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  lineClamp: 1,
                }}
                level={4}
              >
                {title}
              </Typography.Title>
            </Row>
          </a>
        </Link>
      </Col>
      <Col flex={0}>
        <Button
          style={{ paddingLeft: 8, paddingRight: 8 }}
          onClick={toggle}
          type="text"
          className="text-secondary"
        >
          <Icons.DoubleLeftOutlined rotate={isOn ? 180 : 0} />
        </Button>
      </Col>
    </Row>
  );
};
