import React, { FC } from "react";
import { Typography } from "antd";
import { FormSection } from "@dewo/app/components/FormSection";

export const ConnectToDiscordFormSection: FC = ({ children }) => (
  <FormSection label="Discord Integration">
    <Typography.Paragraph type="secondary" style={{ marginBottom: 8 }}>
      Want to automatically create Discord threads to discuss Dework tasks? Try
      out the Discord integration for this project!
    </Typography.Paragraph>
    {children}
  </FormSection>
);
