import { TrelloIcon } from "@dewo/app/components/icons/Trello";
import { Button, Modal, Select, Space, Typography } from "antd";
import { useRouter } from "next/router";
import React, { FC, useCallback, useState } from "react";
import { useOrganization } from "../organization/hooks";
import { useCreateProjectsFromTrello, useTrelloBoards } from "./hooks";
// import { useCreateProjectsFromTrello } from "./hooks";

interface Props {
  threepidId: string;
  organizationId: string;
  visible: boolean;
}

export const ImportProjectsFromTrelloModal: FC<Props> = ({
  threepidId,
  organizationId,
  visible,
}) => {
  const trelloBoards = useTrelloBoards(threepidId);
  const [selectedBoardIds, setSelectedBoardIds] = useState<string[]>([]);

  const { organization } = useOrganization(organizationId);
  const router = useRouter();
  const createProjectsFromTrello = useCreateProjectsFromTrello();

  const [importing, setImporting] = useState(false);
  const handleImport = useCallback(async () => {
    if (!organization) return;
    setImporting(true);
    try {
      await createProjectsFromTrello({
        threepidId,
        organizationId,
        boardIds: selectedBoardIds,
      });
      await router.push(organization.permalink);
    } finally {
      setImporting(false);
    }
  }, [
    organization,
    createProjectsFromTrello,
    router,
    selectedBoardIds,
    organizationId,
    threepidId,
  ]);

  return (
    <Modal visible={visible} closable={false} footer={null}>
      <Typography.Title level={4} style={{ textAlign: "center" }}>
        Import Projects from Trello...
      </Typography.Title>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Typography.Paragraph
          type="secondary"
          style={{ textAlign: "center", margin: 0 }}
        >
          Select Trello Boards to import below. You can select one or multiple!
        </Typography.Paragraph>
        <Select
          loading={!trelloBoards}
          disabled={importing}
          mode="multiple"
          optionFilterProp="label"
          placeholder="Select Trello Boards..."
          style={{ width: "100%" }}
          onChange={(values) => setSelectedBoardIds(values as string[])}
        >
          {trelloBoards?.map((board) => (
            <Select.Option key={board.id} value={board.id} label={board.name}>
              {board.name}
            </Select.Option>
          ))}
        </Select>
        <Button
          block
          loading={importing}
          type="primary"
          size="large"
          disabled={!selectedBoardIds.length}
          icon={<TrelloIcon />}
          onClick={handleImport}
        >
          Import
        </Button>
        {importing && (
          <Typography.Paragraph
            type="secondary"
            style={{ textAlign: "center" }}
          >
            Trello boards and cards are being imported. This might take up to 30
            seconds, depending on how many boards and cards you have. Don't
            refresh the screen!
          </Typography.Paragraph>
        )}
      </Space>
    </Modal>
  );
};
