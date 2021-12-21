import { useSidebarContext } from "@dewo/app/contexts/sidebarContext";
import { Button } from "antd";
import React, { FC } from "react";
import { MenuOutlined } from "@ant-design/icons";
export const MobileHeader: FC<{ asHeader?: boolean }> = ({ asHeader }) => {
  const { toggle } = useSidebarContext();
  return (
    <div
      className="dewo-header-mobile"
      style={asHeader ? { height: 48, padding: "0 16px" } : {}}
    >
      <Button onClick={toggle}>
        <MenuOutlined />
      </Button>
    </div>
  );
};
