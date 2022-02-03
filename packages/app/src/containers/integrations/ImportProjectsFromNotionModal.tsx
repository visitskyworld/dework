import { NotionIcon } from "@dewo/app/components/icons/Notion";
import { Button, Modal, Select, Space, Typography } from "antd";
import { useRouter } from "next/router";
import React, { FC, useCallback, useState } from "react";
import { useOrganization } from "../organization/hooks";
import { useCreateProjectsFromNotion, useNotionDatabases } from "./hooks";

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
  const notionDatabases = useNotionDatabases(threepidId);
  const [selectedDatabaseIds, setSelectedDatabaseIds] = useState<string[]>([]);

  const { organization } = useOrganization(organizationId);
  const router = useRouter();
  const createProjectsFromNotion = useCreateProjectsFromNotion();

  const [importing, setImporting] = useState(false);
  const handleImport = useCallback(async () => {
    if (!organization) return;
    setImporting(true);
    try {
      await createProjectsFromNotion({
        threepidId,
        organizationId,
        databaseIds: selectedDatabaseIds,
      });
      await router.push(organization.permalink);
    } finally {
      setImporting(false);
    }
  }, [
    organization,
    createProjectsFromNotion,
    router,
    selectedDatabaseIds,
    organizationId,
    threepidId,
  ]);

  return (
    <Modal visible={visible} closable={false} footer={null}>
      <Typography.Title level={4} style={{ textAlign: "center" }}>
        Import Projects from Notion...
      </Typography.Title>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Typography.Paragraph
          type="secondary"
          style={{ textAlign: "center", margin: 0 }}
        >
          Select Notion Databases to import below. You can select one or
          multiple!
        </Typography.Paragraph>
        <Select
          loading={!notionDatabases}
          disabled={importing}
          mode="multiple"
          optionFilterProp="label"
          placeholder="Select Notion Databases..."
          style={{ width: "100%" }}
          onChange={(values) => setSelectedDatabaseIds(values as string[])}
        >
          {notionDatabases?.map((database) => (
            <Select.Option
              key={database.id}
              value={database.id}
              label={database.name}
            >
              {database.name}
            </Select.Option>
          ))}
        </Select>
        <Button
          block
          loading={importing}
          type="primary"
          size="large"
          disabled={!selectedDatabaseIds.length}
          icon={<NotionIcon />}
          onClick={handleImport}
        >
          Import
        </Button>
        {importing && (
          <Typography.Paragraph
            type="secondary"
            style={{ textAlign: "center" }}
          >
            Notion databases and cards are being imported. This might take up to
            30 seconds, depending on how many databases and cards you have.
            Don't refresh the screen!
          </Typography.Paragraph>
        )}
      </Space>
    </Modal>
  );
};
