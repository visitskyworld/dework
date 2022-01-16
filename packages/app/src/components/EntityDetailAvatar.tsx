import React, { FC } from "react";
import * as Icons from "@ant-design/icons";
import { Avatar } from "antd";

import { DiscordIcon } from "@dewo/app/components/icons/Discord";
import { EntityDetail, EntityDetailType } from "../graphql/types";
import { useCopyToClipboardAndShowToast } from "../util/hooks";

export const placeholderByType: Record<EntityDetailType, string> = {
  [EntityDetailType.twitter]: "https://twitter.com/lastcontrarian",
  [EntityDetailType.github]: "https://github.com/vbuterin",
  [EntityDetailType.discord]: "vitalik.eth#1036",
  [EntityDetailType.linkedin]: "https://www.linkedin.com/in/balajissrinivasan",
  [EntityDetailType.website]: "https://my-site.com",
  [EntityDetailType.location]: "Lisbon, Portugal",
};

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
  copyToClipboard?: boolean;
}

export const EntityDetailAvatar: FC<EntityDetailsProps> = ({
  entityDetail,
  copyToClipboard = false,
}) => {
  const handleCopyToClipBoard = useCopyToClipboardAndShowToast();

  if (copyToClipboard) {
    return (
      <a
        key={entityDetail.id}
        onClick={() => handleCopyToClipBoard(entityDetail.value)}
      >
        <Avatar size="small">{iconByType[entityDetail.type]}</Avatar>
      </a>
    );
  }

  return (
    <a
      href={entityDetail.value}
      target="_blank"
      key={entityDetail.id}
      rel="noreferrer"
    >
      <Avatar size="small">{iconByType[entityDetail.type]}</Avatar>
    </a>
  );
};
