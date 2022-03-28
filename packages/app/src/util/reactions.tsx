import { Modal, Table } from "antd";
import React, { FC, useCallback, useMemo } from "react";
import { useLazyTaskReactionUsers } from "../containers/task/hooks";
import { User } from "../graphql/types";
import { stopPropagation } from "./eatClick";
import { useToggle } from "./hooks";
import { useNavigateToProfile } from "./navigation";
import { UserAvatar } from "../components/UserAvatar";

export const useReactionModal = (id: string, reaction: string) => {
  const [fetchTaskReactionUsers, { data }] = useLazyTaskReactionUsers(id);
  const users = useMemo(
    () =>
      data?.task.reactions
        .filter((r) => r.reaction === reaction)
        .map((r) => r.user),
    [data, reaction]
  );
  const showUsers = useToggle();
  const handleShowUsers = useCallback(
    (event) => {
      stopPropagation(event);
      showUsers.toggleOn();
      fetchTaskReactionUsers();
    },
    [showUsers, fetchTaskReactionUsers]
  );

  const navigateToProfile = useNavigateToProfile();
  const modal: FC<{}> = useMemo(() => {
    return () => (
      <Modal
        visible={showUsers.isOn}
        footer={null}
        onCancel={showUsers.toggleOff}
      >
        <Table<User>
          dataSource={users}
          size="small"
          loading={!users}
          pagination={{ hideOnSinglePage: true }}
          onRow={(user) => ({ onClick: () => navigateToProfile(user) })}
          style={{ cursor: "pointer" }}
          columns={[
            {
              key: "avatar",
              width: 1,
              render: (_, user: User) => <UserAvatar user={user} />,
            },
            { dataIndex: "username" },
          ]}
        />
      </Modal>
    );
  }, [showUsers, users, navigateToProfile]);

  return [handleShowUsers, modal] as const;
};
