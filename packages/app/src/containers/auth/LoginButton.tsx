import { useToggle } from "@dewo/app/util/hooks";
import { Button, ButtonProps } from "antd";
import React, { FC } from "react";
import { LoginModal } from "./LoginModal";

export const LoginButton: FC<ButtonProps> = ({ className, ...props }) => {
  const modalVisible = useToggle();
  return (
    <>
      <Button {...props} onClick={modalVisible.toggleOn} />
      <LoginModal toggle={modalVisible} />
    </>
  );
};
