import React, { FC } from "react";
import { Checkbox, Form } from "antd";
import {
  useOrganizationDetails,
  useUpdateOrganization,
} from "../../organization/hooks";
import { usePermission } from "@dewo/app/contexts/PermissionsContext";

interface Props {
  organizationId: string;
}

export const OrganizationSettingsNftMinting: FC<Props> = ({
  organizationId,
}) => {
  const canUpdateOrganization = usePermission("update", "Organization");

  const { organization } = useOrganizationDetails(organizationId);
  const updateOrganization = useUpdateOrganization();

  return (
    <Form.Item
      label="NFT Minting"
      labelCol={{ span: 24 }}
      tooltip="As a V1 for on-chain credentialing, we mint ERC-721 NFTs with the task metadata of the work you complete on Dework. It will show up on the task cards as well as on OpenSea, see eg: https://opensea.io/collection/dework"
      style={{ margin: 0 }}
    >
      <Checkbox
        checked={organization?.mintTaskNFTs}
        disabled={!canUpdateOrganization}
        onChange={({ target }) => {
          updateOrganization({
            id: organizationId,
            mintTaskNFTs: target.checked,
          });
        }}
      >
        Mint Task NFTs
      </Checkbox>
    </Form.Item>
  );
};
