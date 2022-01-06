import { useToggle } from "@dewo/app/util/hooks";
import { Button, ButtonProps } from "antd";
import React, { FC, useCallback } from "react";
import { LoginModal } from "./LoginModal";

export const LoginButton: FC<ButtonProps> = ({
  className,
  onClick,
  ...props
}) => {
  const modalVisible = useToggle();
  const handleClick = useCallback(
    (e) => {
      onClick?.(e);
      modalVisible.toggleOn();
    },
    [onClick, modalVisible]
  );
  return (
    <>
      <Button {...props} onClick={handleClick} />
      <LoginModal toggle={modalVisible} />
    </>
  );
};
