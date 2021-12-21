import React, { FC } from "react";
import Link from "next/link";
import * as Icons from "@ant-design/icons";
import { Form, Avatar, Input, Space } from "antd";

import { UserDetailType, UserProfile_details } from "../../graphql/types";

interface UserDetailIconProps {
  type: UserDetailType;
}

const UserDetailIcon: FC<UserDetailIconProps> = ({ type }) => {
  switch (type) {
    case UserDetailType.twitter:
      return <Icons.TwitterOutlined />;
    case UserDetailType.github:
      return <Icons.GithubOutlined />;
    case UserDetailType.linkedin:
      return <Icons.LinkedinFilled />;
    default:
      return <Icons.LinkOutlined />;
  }
};

interface UserDetailsProps {
  isEditMode: boolean;
  userDetails: UserProfile_details[];
}

export const UserDetails: FC<UserDetailsProps> = ({
  isEditMode,
  userDetails,
}) => {
  if (!userDetails) return null;

  if (isEditMode) {
    return (
      <>
        {Object.values(UserDetailType).map((type) => type!== UserDetailType.country && (
          <div
            key={type}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              margin: "12px 0 16px 0",
            }}
          >
            <UserDetailIcon type={type} />
            <Form.Item
              name={type}
              style={{
                flex: 1,
                margin: "0 0 0 7px",
              }}
            >
              <Input.TextArea
                rows={1}
                wrap="off"
                placeholder={type}
                className="dewo-field dewo-field-profile ant-typography-p"
                style={{ maxHeight: 28 }}
              />
            </Form.Item>
          </div>
        ))}
      </>
    );
  }

  return (
    <Space style={{ margin: "2px 0 12px 0" }}>
      {userDetails.map((detail, index) => (
        <Link key={index} href={detail.value}>
          <a>
            <Avatar size="small">
              <UserDetailIcon type={detail.type} />
            </Avatar>
          </a>
        </Link>
      ))}
    </Space>
  );
};
