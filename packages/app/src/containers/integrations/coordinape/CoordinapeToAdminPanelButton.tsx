import React from "react";
import { Button, Tooltip } from "antd";
import { CoordinapeIcon } from "@dewo/app/components/icons/Coordinape";

export const CoordinapeToAdminPanelButton = () => (
  <Tooltip
    title={`Open "Settings" in the Coordinape Circle Admin page to connect Dework`}
  >
    <Button
      icon={<CoordinapeIcon />}
      href="https://app.coordinape.com/admin"
      target="_blank"
    >
      Connect to Coordinape
    </Button>
  </Tooltip>
);
