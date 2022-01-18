import React, { FC, ReactNode } from "react";
import { Button, Divider } from "antd";
import * as Icons from "@ant-design/icons";
import { useToggle, UseToggleHook } from "../util/hooks";

interface Props {
  toggle?: UseToggleHook;
  children: ReactNode;
}

export const AdvancedSectionCollapse: FC<Props> = ({ children, toggle }) => {
  const fallbackToggle = useToggle();
  const actualToggle = toggle ?? fallbackToggle;
  return (
    <>
      <Divider plain style={{ marginBottom: 0 }}>
        <Button
          type="text"
          style={{ padding: "0 8px", height: "unset" }}
          className="text-secondary"
          onClick={actualToggle.toggle}
        >
          Advanced
          {actualToggle.isOn ? <Icons.UpOutlined /> : <Icons.DownOutlined />}
        </Button>
      </Divider>
      {actualToggle.isOn && children}
    </>
  );
};
