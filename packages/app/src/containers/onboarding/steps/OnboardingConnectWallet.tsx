import { Button, Dropdown, Image, Menu, Space, Typography } from "antd";
import React, { FC } from "react";
import ConnectWalletGraphic from "@dewo/app/assets/connect-wallet.svg";
import { HiroAuthButton } from "../../auth/buttons/HiroAuthButton";
import { MetamaskAuthButton } from "../../auth/buttons/MetamaskAuthButton";
import { PhantomAuthButton } from "../../auth/buttons/PhantomAuthButton";
import { OnboardingUSPs } from "../OnboardingUSPs";

const usps = [
  "💰   Get paid for tasks and bounties you complete",
  "🔑   Join token/NFT gated projects",
];
interface Props {
  active: boolean;
  onNext(): void;
}

export const OnboardingConnectWallet: FC<Props> = ({ active, onNext }) => {
  return (
    <>
      <Typography.Title level={2} style={{ textAlign: "center" }}>
        Connect your Wallet
      </Typography.Title>
      <Image
        src={ConnectWalletGraphic.src}
        preview={false}
        style={{ width: "60%" }}
        className="mx-auto"
      />
      <OnboardingUSPs usps={usps} />
      <Space
        direction="vertical"
        className="mx-auto w-full"
        style={{ display: "flex", maxWidth: 368, marginBottom: 16 }}
      >
        <MetamaskAuthButton
          children="Metamask"
          size="large"
          block
          type="primary"
          onAuthed={onNext}
        />
        <Dropdown
          placement="bottomCenter"
          trigger={["click"]}
          {...(!active && { visible: false })}
          overlay={
            <Menu>
              <PhantomAuthButton
                children="Phantom"
                size="large"
                block
                type="text"
                onAuthed={onNext}
              />
              <HiroAuthButton
                children="Hiro"
                size="large"
                block
                type="text"
                onAuthed={onNext}
              />
            </Menu>
          }
        >
          <Button size="large" block>
            More Options
          </Button>
        </Dropdown>
      </Space>
      <Button
        type="text"
        style={{ alignSelf: "center" }}
        className="text-secondary"
        onClick={onNext}
      >
        Not now
      </Button>
    </>
  );
};
