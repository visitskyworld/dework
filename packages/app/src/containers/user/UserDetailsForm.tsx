import React, { FC } from "react";
import Link from "next/link";
import * as Icons from "@ant-design/icons";
import { Form, Avatar, Typography } from "antd";

import {
  UserDetail,
  UserDetailType,
  UserProfile_details,
} from "../../graphql/types";

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

interface UserDetailsFormProps {
  isEditMode: boolean;
  userDetails: UserProfile_details[];
}

export const UserDetailsForm: FC<UserDetailsFormProps> = ({
  isEditMode,
  userDetails,
}) => {
  const onChange = (userDetail: UserDetail) => {
    console.log([...userDetails, userDetail]);
  };

  if (!userDetails) return null;

  if (isEditMode) {
    return (
      <>
        {userDetails.map((detail) => (
          <Form.Item
            key={detail.id}
            style={{ display: "flex", flexDirection: "row" }}
            rules={[
              {
                type: "url",
                warningOnly: true,
              },
            ]}
          >
            <UserDetailIcon type={detail.type} />
            <Typography.Text
              style={{ flex: 1, marginLeft: 5 }}
              type="secondary"
              editable={{
                onChange: (value: string) => onChange({ ...detail, value }),
              }}
            >
              {detail.value}
            </Typography.Text>
          </Form.Item>
        ))}
      </>
    );
  }

  return (
    <div style={{ margin: "2px 0 12px 0" }}>
      {userDetails.map((detail, index) => (
        <Link key={index} href={detail.value}>
          <a>
            <Avatar size="small">
              <UserDetailIcon type={detail.type} />
            </Avatar>
          </a>
        </Link>
      ))}
    </div>
  );
};
