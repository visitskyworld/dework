import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { ThreepidSource } from "@dewo/app/graphql/types";
import { Alert, Col, Space, Typography } from "antd";
import React, { FC } from "react";
import { MetamaskAuthButton } from "../auth/MetamaskAuthButton";
import { PhantomAuthButton } from "../auth/PhantomAuthButton";
import {
  getThreepidName,
  renderThreepidIcon,
  ThreepidAuthButton,
} from "../auth/ThreepidAuthButton";

interface Props {}

export const UserSettings: FC<Props> = () => {
  const { user } = useAuthContext();
  // Some keys of ThreepidSource are in authMap
  const authComponentMap: Partial<Record<ThreepidSource, FC>> = {
    [ThreepidSource.metamask]: MetamaskAuthButton,
    [ThreepidSource.phantom]: PhantomAuthButton,
  };

  function Dynamic<T>({ is: IsComponent, props }: { is: FC<T>; props?: T }) {
    return <IsComponent {...(props as T)} />;
  }

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Col>
        <Typography.Title level={5}>Connected Accounts</Typography.Title>
        <Space direction="vertical">
          {[
            ThreepidSource.github,
            ThreepidSource.discord,
            ThreepidSource.metamask,
            ThreepidSource.phantom,
          ].map((source) =>
            user?.threepids.some((t) => t.source === source) ? (
              <Alert
                key={source}
                message={`Connected with ${getThreepidName[source]}`}
                icon={renderThreepidIcon[source]}
                type="success"
                showIcon
              />
            ) : authComponentMap[source] ? (
              <Dynamic is={authComponentMap[source]!} key={source} />
            ) : (
              <ThreepidAuthButton
                key={source}
                source={source}
                children={`Connect with ${getThreepidName[source]}`}
              />
            )
          )}
        </Space>
      </Col>
    </Space>
  );
};
