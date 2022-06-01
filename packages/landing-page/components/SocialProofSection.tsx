import React, { FC } from "react";
import { Layout, Space, Avatar, Row, Typography } from "antd";
import styles from "./LandingPage.module.less";

interface Item {
  name: string;
  imageUrl: string;
}

const imagePrefix = "https://storage.googleapis.com/assets.dework.xyz/uploads";
const items: Item[] = [
  {
    name: "Poapathon",
    imageUrl: "85b10e62-4d73-4227-9f06-b6a8585a3ef0/9Jj9wAK4_400x400.png",
  },
  {
    name: "Nation3",
    imageUrl: "ef81a37c-f462-4451-86d3-6a992df3a608/ezgif-2-06636d317a.gif",
  },
  {
    name: "The Open DAO",
    imageUrl: "f86c0cc7-6eb6-4711-aa9c-e6d51d8cab50/400x400-sos.png",
  },
  {
    name: "CityDAO",
    imageUrl: "20c0baff-0ead-4634-b223-871f7591a35c/citydao-logo.png",
  },
  {
    name: "0xPolygon DAO",
    imageUrl: "abfc28d6-2a9b-4408-9dfa-319c710a8d26/matic-token-icon.webp",
  },
  {
    name: "Aragon DAO",
    imageUrl:
      "04c03d01-1c29-40d9-96bd-06bc7b588756/618424d754f10e4fa707bfbf_logo_aragon.png",
  },
  {
    name: "Metaguild",
    imageUrl: "7f863d33-0a38-4b59-8f14-e8aee0aad997/black.png",
  },
  {
    name: "Juicebox DAO",
    imageUrl: "6d550167-6585-4e95-8030-940cf9f67965/OG-logo.png",
  },
  {
    name: "Gitcoin",
    imageUrl: "cacd62e1-9565-4892-8f9d-605e26c551c8/negative.png",
  },
  {
    name: "Bankless DAO",
    imageUrl:
      "fcdee58e-14e4-45c1-a35e-74aba4f4e6bf/BanklessDAO_-BANKLogo_ForDarkBackground_512X512-1.png",
  },
  {
    name: "Developer DAO",
    imageUrl: "2f76d32f-2d17-4a71-9da0-e7600ea26d4a/d-d-logo.png",
  },
  {
    name: "1Hive",
    imageUrl: "15a75604-b0a4-46a1-bc42-e2e80fe3e45c/bee2.png",
  },
  {
    name: "Shapeshift DAO",
    imageUrl: "55242cbb-b444-4b27-88cf-7d3424c37605/FOX_Icon_dark.svg",
  },
].map((item) => ({
  name: item.name,
  imageUrl: [imagePrefix, item.imageUrl].join("/"),
}));

const row1 = items.slice(0, Math.round(items.length / 2));
const row2 = items.slice(Math.round(items.length / 2));

export const SocialProofSection: FC = () => {
  const itemWidth = 150;
  return (
    <Layout.Content className={styles.darkSection}>
      <Typography.Paragraph
        strong
        type="secondary"
        style={{ textTransform: "uppercase", textAlign: "center" }}
      >
        Powering the next generation of organizations
      </Typography.Paragraph>
      <Space
        direction="vertical"
        size="large"
        style={{ width: "100%" }}
        className={styles.carouselFader}
      >
        {[row1, row2].map((items, index) => (
          <Row
            key={index}
            className={styles.carouselSlider}
            style={{
              overflow: "hidden",
              flexFlow: "unset",
              // width: "200%",
              width: items.length * 4 * itemWidth,
              marginLeft: index * 80,
            }}
          >
            {[...items, ...items, ...items, ...items].map((item) => (
              <Row
                align="middle"
                justify="center"
                key={index}
                style={{ columnGap: 8, flexShrink: 0, width: itemWidth }}
              >
                <Avatar size="small" src={item.imageUrl} alt={item.name} />
                <Typography.Text className="font-semibold">
                  {item.name}
                </Typography.Text>
              </Row>
            ))}
          </Row>
        ))}
      </Space>
    </Layout.Content>
  );
};
