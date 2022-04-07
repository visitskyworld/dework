import { ThreepidSource } from "@dewo/app/graphql/types";
import { Button, Space, Typography, Image } from "antd";
import React, { FC } from "react";
import ConnectToDiscordGraphic from "@dewo/app/assets/connect-to-discord.svg";
import { ThreepidAuthButton } from "../../auth/buttons/ThreepidAuthButton";
import { OnboardingUSPs } from "../OnboardingUSPs";

const usps = [
  "🏰   Get special access with your Discord roles",
  "💬   Receive task updates directly in Discord",
  // "🌎   Discover DAOs based on the servers you're in",
];

interface Props {
  onNext(): void;
}

export const OnboardingConnectDiscord: FC<Props> = ({ onNext }) => {
  return (
    <>
      <Typography.Title level={2} style={{ textAlign: "center" }}>
        Link your Discord account
      </Typography.Title>
      <Typography.Paragraph
        type="secondary"
        style={{ textAlign: "center", fontSize: "130%" }}
      >
        Dework works better with Discord connected
      </Typography.Paragraph>
      <Image
        src={ConnectToDiscordGraphic.src}
        preview={false}
        style={{ width: "40%" }}
        className="mx-auto"
      />
      <OnboardingUSPs usps={usps} />
      <Space direction="vertical" size="small" align="center">
        <ThreepidAuthButton
          source={ThreepidSource.discord}
          children="Connect Discord"
          type="primary"
          size="large"
          style={{ alignSelf: "center" }}
        />
        <Button
          type="text"
          style={{ alignSelf: "center" }}
          className="text-secondary"
          onClick={onNext}
        >
          Not now
        </Button>
      </Space>
    </>
  );
};
