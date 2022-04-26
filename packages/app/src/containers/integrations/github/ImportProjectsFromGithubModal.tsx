import { Button, Modal, Select, Space, Typography } from "antd";
import { useRouter } from "next/router";
import * as Icons from "@ant-design/icons";
import React, { FC, useCallback, useState } from "react";
import {
  useOrganization,
  useOrganizationGithubRepos,
} from "../../organization/hooks";
import { useCreateProjectsFromGithub } from "../hooks";

interface Props {
  organizationId: string;
  visible: boolean;
}

export const ImportProjectsFromGithubModal: FC<Props> = ({
  organizationId,
  visible,
}) => {
  const githubRepos = useOrganizationGithubRepos(organizationId);
  const [selectedRepoIds, setSelectedRepoIds] = useState<string[]>([]);

  const organization = useOrganization(organizationId);
  const router = useRouter();
  const createProjectsFromGithub = useCreateProjectsFromGithub();

  const [importing, setImporting] = useState(false);
  const handleImport = useCallback(async () => {
    if (!organization) return;
    setImporting(true);
    try {
      await createProjectsFromGithub({
        organizationId,
        repoIds: selectedRepoIds,
      });
      await router.push(organization.permalink);
    } finally {
      setImporting(false);
    }
  }, [
    organization,
    router,
    selectedRepoIds,
    organizationId,
    createProjectsFromGithub,
  ]);

  return (
    <Modal visible={visible} closable={false} footer={null}>
      <Typography.Title level={4} style={{ textAlign: "center" }}>
        Import Repos from Github...
      </Typography.Title>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Typography.Paragraph
          type="secondary"
          style={{ textAlign: "center", margin: 0 }}
        >
          Select Github Repos to import below. You can select one or multiple!
        </Typography.Paragraph>
        <Select
          loading={!githubRepos}
          disabled={importing}
          mode="multiple"
          optionFilterProp="label"
          placeholder="Select Github Repos..."
          style={{ width: "100%" }}
          onChange={(values) => setSelectedRepoIds(values as string[])}
        >
          {githubRepos?.map((repo) => (
            <Select.Option key={repo.id} value={repo.id} label={repo.name}>
              {repo.name}
            </Select.Option>
          ))}
        </Select>
        <Button
          block
          loading={importing}
          type="primary"
          size="large"
          disabled={!selectedRepoIds.length}
          icon={<Icons.GithubOutlined />}
          onClick={handleImport}
        >
          Import
        </Button>
        {importing && (
          <Typography.Paragraph
            type="secondary"
            style={{ textAlign: "center" }}
          >
            Github repos and issues are being imported. This might take up to 30
            seconds, depending on how many repos and issues you have. Don't
            refresh the screen!
          </Typography.Paragraph>
        )}
      </Space>
    </Modal>
  );
};
