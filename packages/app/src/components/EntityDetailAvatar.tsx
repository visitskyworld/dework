import React, { FC } from "react";
import * as Icons from "@ant-design/icons";
import { Avatar } from "antd";

import { DiscordIcon } from "@dewo/app/components/icons/Discord";
import { EntityDetail, EntityDetailType } from "../graphql/types";

export const iconByType: Record<EntityDetailType, JSX.Element> = {
  [EntityDetailType.twitter]: <Icons.TwitterOutlined />,
  [EntityDetailType.github]: <Icons.GithubOutlined />,
  [EntityDetailType.discord]: <DiscordIcon />,
  [EntityDetailType.linkedin]: <Icons.LinkedinFilled />,
  [EntityDetailType.website]: <Icons.LinkOutlined />,
  [EntityDetailType.location]: <Icons.EnvironmentOutlined />,
};

interface EntityDetailsProps {
  entityDetail: EntityDetail;
}

export const EntityDetailAvatar: FC<EntityDetailsProps> = ({
  entityDetail,
}) => (
  <a
    href={entityDetail.value}
    target="_blank"
    key={entityDetail.id}
    rel="noreferrer"
  >
    <Avatar size="small">{iconByType[entityDetail.type]}</Avatar>
  </a>
);
