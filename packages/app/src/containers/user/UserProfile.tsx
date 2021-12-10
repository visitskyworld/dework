import React, { FC, useCallback } from "react";
import { Space, Typography, Col } from "antd";
import { useUpdateUser, useUser } from "./hooks";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { CoverImageLayout } from "@dewo/app/components/CoverImageLayout";
import { UserAvatar } from "@dewo/app/components/UserAvatar";

interface Props {
  userId: string;
}

export const UserProfile: FC<Props> = ({ userId }) => {
  const user = useUser(userId);

  const currentUserId = useAuthContext().user?.id;
  const isMe = userId === currentUserId;

  const updateUser = useUpdateUser();
  const updateUsername = useCallback(
    (username: string) => updateUser({ username }),
    [updateUser]
  );
  const updateBio = useCallback(
    (bio: string) => updateUser({ bio }),
    [updateUser]
  );

  if (!user) return null;
  return (
    <CoverImageLayout
      // imageUrl="https://image.freepik.com/free-vector/gradient-liquid-abstract-background_23-2148902633.jpg"
      avatar={<UserAvatar size={128} user={user} />}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Col>
          <Typography.Title
            level={3}
            style={{ textAlign: "center" }}
            editable={isMe ? { onChange: updateUsername } : undefined}
          >
            {user.username}
          </Typography.Title>
          <Typography.Paragraph
            editable={isMe ? { onChange: updateBio } : undefined}
            style={{ textAlign: "center" }}
          >
            {!user.bio && (
              <Typography.Text type="secondary">No bio...</Typography.Text>
            )}
            {user.bio}
          </Typography.Paragraph>
        </Col>
      </Space>
    </CoverImageLayout>
  );
};
