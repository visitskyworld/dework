import { useToggle } from "@dewo/app/util/hooks";
import { Button, ButtonProps } from "antd";
import React, { FC, useCallback } from "react";
import { LoginModal } from "./LoginModal";

interface Props extends ButtonProps {
  onAuthedWithMetamask?(): void;
}

export const LoginButton: FC<Props> = ({
  onAuthedWithMetamask,
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
  const handleAuthedWithMetamask = useCallback(() => {
    onAuthedWithMetamask?.();
    modalVisible.toggleOff();
  }, [onAuthedWithMetamask, modalVisible]);
  return (
    <>
      <Button {...props} onClick={handleClick} />
      <LoginModal
        toggle={modalVisible}
        onAuthedWithMetamask={handleAuthedWithMetamask}
      />
    </>
  );
};
