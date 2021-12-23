import React, { FC, useMemo } from "react";
import * as Icons from "@ant-design/icons";
import { Form, Avatar, Input, Space, Typography } from "antd";

import { UserDetailType, UserDetail } from "../../graphql/types";

const iconByType: Record<UserDetailType, JSX.Element> = {
  [UserDetailType.twitter]: <Icons.TwitterOutlined />,
  [UserDetailType.github]: <Icons.GithubOutlined />,
  [UserDetailType.linkedin]: <Icons.LinkedinFilled />,
  [UserDetailType.website]: <Icons.LinkOutlined />,
  [UserDetailType.country]: <Icons.FlagOutlined />,
};

const placeholderByType: Record<UserDetailType, string> = {
  [UserDetailType.twitter]: "https://twitter.com/lastcontrarian",
  [UserDetailType.github]: "https://github.com/vbuterin",
  [UserDetailType.linkedin]: "https://www.linkedin.com/in/balajissrinivasan",
  [UserDetailType.website]: "https://my-site.com",
  [UserDetailType.country]: "Lisbon, Portugal",
};

interface UserDetailsProps {
  isEditMode: boolean;
  userDetails: UserDetail[];
}

export const UserDetails: FC<UserDetailsProps> = ({
  isEditMode,
  userDetails,
}) => {
  const countryDetail = useMemo(
    () =>
      userDetails.find(
        (detail) =>
          detail.type === UserDetailType.country && detail.value !== ""
      ),
    [userDetails]
  );

  if (isEditMode) {
    return (
      <Space direction="vertical" style={{ width: "100%" }}>
        {Object.values(UserDetailType).map((type) => (
          <div key={type} style={{ display: "flex", alignItems: "center" }}>
            {iconByType[type]}
            <Form.Item name={type} style={{ flex: 1, margin: "0 0 0 7px" }}>
              <Input
                placeholder={placeholderByType[type]}
                className="dewo-field dewo-field-profile ant-typography-p"
              />
            </Form.Item>
          </div>
        ))}
      </Space>
    );
  }

  return (
    <Space>
      {userDetails.map(
        (detail, index) =>
          detail.type !== UserDetailType.country && (
            <a href={detail.value} target="_blank" key={index} rel="noreferrer">
              <Avatar size="small">{iconByType[detail.type]}</Avatar>
            </a>
          )
      )}
      {countryDetail && (
        <>
          {iconByType[countryDetail.type]}
          <Typography.Text
            type="secondary"
            ellipsis
            style={{ maxWidth: "160px" }}
          >
            {countryDetail.value}
          </Typography.Text>
        </>
      )}
    </Space>
  );
};
