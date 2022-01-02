import React, { FC } from "react";
import { Typography } from "antd";
import { FormSection } from "@dewo/app/components/FormSection";

export const ConnectToGithubFormSection: FC = ({ children }) => (
  <FormSection label="Github Integration">
    <Typography.Paragraph type="secondary" style={{ marginBottom: 8 }}>
      Want to automatically link Github branches and make pull requests show up
      in tasks? Try out the Github integration for this project!
    </Typography.Paragraph>
    {children}
  </FormSection>
);
