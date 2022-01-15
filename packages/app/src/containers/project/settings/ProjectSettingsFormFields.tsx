import React, { FC } from "react";
import { useToggle } from "@dewo/app/util/hooks";
import { Button, Checkbox, Divider, Form, Radio } from "antd";
import * as Icons from "@ant-design/icons";
import {
  OrganizationDetails,
  ProjectVisibility,
} from "@dewo/app/graphql/types";
import { FormSection } from "@dewo/app/components/FormSection";
import { DiscordIntegrationFormFields } from "../../integrations/CreateDiscordIntegrationForm";
import { ConnectOrganizationToDiscordButton } from "../../integrations/ConnectOrganizationToDiscordButton";
import { FormValues } from "../create/ProjectCreateForm";
import { OrganizationDiscordChannels } from "../../organization/hooks";

interface Props {
  organization: OrganizationDetails | undefined;
  discordChannels: OrganizationDiscordChannels;
  discordThreads: OrganizationDiscordChannels;
  hasDiscordIntegration: boolean;
  values: Partial<FormValues>;
}
export const ProjectSettingsFormFields: FC<Props> = ({
  organization,
  discordChannels,
  discordThreads,
  hasDiscordIntegration,
  values,
}) => {
  const advancedOptions = useToggle(true);

  return (
    <>
      <Form.Item
        label="Visibility"
        name="visibility"
        tooltip="By default all projects are public. Make a project private if you only want to share it with invited contributors."
      >
        <Radio.Group>
          <Radio.Button value={ProjectVisibility.PUBLIC}>Public</Radio.Button>
          <Radio.Button value={ProjectVisibility.PRIVATE}>Private</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Divider plain>
        <Button
          type="text"
          style={{ padding: "0 8px", height: "unset" }}
          className="text-secondary"
          onClick={advancedOptions.toggle}
        >
          Advanced
          {advancedOptions.isOn ? <Icons.UpOutlined /> : <Icons.DownOutlined />}
        </Button>
      </Divider>
      {advancedOptions.isOn && (
        <>
          {!!organization && (
            <FormSection label="Discord Integration">
              {hasDiscordIntegration ? (
                <DiscordIntegrationFormFields
                  values={values}
                  channels={discordChannels.value}
                  threads={discordThreads.value}
                  onRefetchChannels={discordChannels.refetch}
                />
              ) : (
                <ConnectOrganizationToDiscordButton
                  organizationId={organization.id}
                />
              )}
            </FormSection>
          )}
        </>
      )}
      <Form.Item hidden={!advancedOptions.isOn}>
        <Form.Item
          name={["options", "showBacklogColumn"]}
          valuePropName="checked"
          label="Contributor Suggestions"
          tooltip="Show a column to the left of 'To Do' where contributors can suggest and vote on tasks."
        >
          <Checkbox>Enable Suggestions Column</Checkbox>
        </Form.Item>
      </Form.Item>
    </>
  );
};
