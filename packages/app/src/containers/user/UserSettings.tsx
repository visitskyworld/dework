import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { ThreepidSource } from "@dewo/app/graphql/types";
import {
  Alert,
  Button,
  Col,
  Divider,
  Popconfirm,
  Space,
  Typography,
} from "antd";
import * as Icons from "@ant-design/icons";
import * as Colors from "@ant-design/colors";
import React, { FC, useMemo } from "react";
import { MetamaskAuthButton } from "../auth/buttons/MetamaskAuthButton";
import { PhantomAuthButton } from "../auth/buttons/PhantomAuthButton";
import {
  getThreepidName,
  renderThreepidIcon,
  ThreepidAuthButton,
} from "../auth/buttons/ThreepidAuthButton";
import { useDeleteThreepid } from "../auth/hooks";
import { useRunningCallback } from "@dewo/app/util/hooks";
import { useSetUserSkills } from "../skills/hooks";
import { SkillSelect } from "@dewo/app/components/form/SkillSelect";

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

  const deleteThreepid = useDeleteThreepid();
  const [handleDeleteThreepid, deletingThreepid] = useRunningCallback(
    deleteThreepid,
    [deleteThreepid]
  );

  const skillIds = useMemo(
    () => user?.skills.map((s) => s.id) ?? [],
    [user?.skills]
  );
  const setSkills = useSetUserSkills();

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Col>
        <Typography.Title level={5}>Skills</Typography.Title>
        <Typography.Paragraph type="secondary">
          Select your skills. This is used to show you relevant tasks and find
          interesting projects.
        </Typography.Paragraph>
        <SkillSelect
          placeholder="Select skills..."
          value={skillIds}
          style={{ width: "100%" }}
          onChange={setSkills}
        />
        <Divider />
        <Typography.Title level={5}>Connected Accounts</Typography.Title>
        <Space direction="vertical">
          {[
            ThreepidSource.github,
            ThreepidSource.discord,
            ThreepidSource.metamask,
            ThreepidSource.phantom,
          ].map((source) => {
            const threepid = user?.threepids.find((t) => t.source === source);
            if (!!user && !!threepid) {
              return (
                <Alert
                  key={source}
                  message={`Connected with ${getThreepidName[source]}`}
                  icon={renderThreepidIcon[source]}
                  type="success"
                  showIcon
                  action={
                    user.threepids.length > 1 && (
                      <Popconfirm
                        icon={
                          <Icons.DeleteOutlined
                            style={{ color: Colors.grey.primary }}
                          />
                        }
                        title={`Disconnect ${getThreepidName[source]}?`}
                        okType="danger"
                        okText="Disconnect"
                        onConfirm={() => handleDeleteThreepid(threepid.id)}
                      >
                        <Button
                          size="small"
                          type="text"
                          className="text-secondary"
                          loading={deletingThreepid}
                          icon={<Icons.CloseOutlined />}
                        />
                      </Popconfirm>
                    )
                  }
                />
              );
            }

            if (!!authComponentMap[source]) {
              return <Dynamic is={authComponentMap[source]!} key={source} />;
            }

            return (
              <ThreepidAuthButton
                key={source}
                source={source}
                children={`Connect with ${getThreepidName[source]}`}
              />
            );
          })}
        </Space>
      </Col>
    </Space>
  );
};
