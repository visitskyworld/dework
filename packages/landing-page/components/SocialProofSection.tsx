import React, { FC, useMemo } from "react";
import { Grid, Space, Avatar, Row, Typography } from "antd";
import _ from "lodash";
import styles from "./LandingPage.module.less";

interface Item {
  title: string;
  imageUrl: string;
}

const items: Item[] = _.range(120).map((index) => ({
  title: `DAO ${index}`,
  imageUrl:
    "https://storage.googleapis.com/assets.dework.xyz/uploads/32c276dc-d821-4808-8cc7-1ea90996ca7a/xiLGl9-f.png",
}));

export const SocialProofSection: FC = () => {
  const breakpoints = Grid.useBreakpoint();
  const numCols = useMemo(() => {
    if (breakpoints.xxl) return 12;
    if (breakpoints.xl) return 8;
    if (breakpoints.lg) return 6;
    if (breakpoints.md) return 5;
    if (breakpoints.sm) return 4;
    if (breakpoints.xs) return 3;
    return 6;
  }, [breakpoints]);
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Typography.Title
        level={5}
        style={{ textTransform: "uppercase", textAlign: "center" }}
      >
        Powering the next generation of organizations
      </Typography.Title>

      {[styles.slider1, styles.slider2].map((className, index) => (
        <Row
          key={index}
          className={className}
          style={{ overflow: "hidden", flexFlow: "unset", width: "200%" }}
        >
          {[
            ...items.slice(numCols * index, numCols * (index + 1)),
            ...items.slice(numCols * index, numCols * (index + 1)),
          ].map((item) => (
            <Row
              align="middle"
              key={index}
              style={{
                columnGap: 8,
                flexShrink: 0,
                width: `${100 / 2 / numCols}%`,
              }}
            >
              <Avatar size="small" src={item.imageUrl} alt={item.title} />
              <Typography.Text className="font-semibold">
                {item.title}
              </Typography.Text>
            </Row>
          ))}
        </Row>
      ))}
    </Space>
  );
};
