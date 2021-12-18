import React, { FC } from "react";
import { FormSection } from "@dewo/app/components/FormSection";
import * as Icons from "@ant-design/icons";
import { Alert, Button, Typography } from "antd";
import { useConnectToGithubUrl } from "../../project/settings/ProjectGithubIntegrations";

interface Props {
  projectId: string;
}

export const ConnectGithubAlert: FC<Props> = ({ projectId }) => {
  const connectToGithubUrl = useConnectToGithubUrl(projectId);
  return (
    <FormSection label="Github">
      <Alert
        message={
          <>
            <Typography.Text>
              Want to automatically link Github branches and make pull requests
              show up here? Set up our Github integration for this project.
            </Typography.Text>
            <br />
            <Button
              size="small"
              style={{ marginTop: 4 }}
              icon={<Icons.GithubOutlined />}
              href={connectToGithubUrl}
            >
              Connect to Github
            </Button>
          </>
        }
        closable
        onClose={
          // TODO(fant): make sure to not show this prompt for this project again
          undefined
        }
      />
    </FormSection>
  );
};
