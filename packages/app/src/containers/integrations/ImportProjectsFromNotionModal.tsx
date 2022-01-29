import { Modal, Spin, Typography } from "antd";
import { useRouter } from "next/router";
import React, { FC, useEffect } from "react";
import { useOrganization } from "../organization/hooks";
import { useCreateProjectsFromNotion } from "./hooks";

interface Props {
  threepidId: string;
  organizationId: string;
  visible: boolean;
}

export const ImportProjectsFromNotionModal: FC<Props> = ({
  threepidId,
  organizationId,
  visible,
}) => {
  const { organization } = useOrganization(organizationId);
  const router = useRouter();
  const createProjectsFromNotion = useCreateProjectsFromNotion();
  useEffect(() => {
    if (!organization || !visible) return;
    createProjectsFromNotion({ threepidId, organizationId }).then(() =>
      router.push(organization.permalink)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!organization, visible]);
  return (
    <Modal visible={visible} closable={false} footer={null}>
      <Typography.Title level={4} style={{ textAlign: "center" }}>
        Importing Projects from Notion...
      </Typography.Title>
      <Typography.Paragraph type="secondary" style={{ textAlign: "center" }}>
        This might take up to 30 seconds, depending on how many projects and
        cards you have.
      </Typography.Paragraph>
      <div style={{ display: "grid" }}>
        <Spin />
      </div>
    </Modal>
  );
};
