import React, { FC, ReactNode } from "react";
import { Button, Divider } from "antd";
import * as Icons from "@ant-design/icons";
import { useToggle, UseToggleHook } from "../util/hooks";
import { HeadlessCollapse } from "./HeadlessCollapse";

interface Props {
  toggle?: UseToggleHook;
  label: string;
  children: ReactNode;
}

export const MoreSectionCollapse: FC<Props> = ({ children, label, toggle }) => {
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
          {label}
          {actualToggle.isOn ? <Icons.UpOutlined /> : <Icons.DownOutlined />}
        </Button>
      </Divider>
      <HeadlessCollapse expanded={actualToggle.isOn}>
        {children}
      </HeadlessCollapse>
    </>
  );
};
