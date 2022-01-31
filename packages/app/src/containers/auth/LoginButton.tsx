import { useToggle } from "@dewo/app/util/hooks";
import { Button, ButtonProps } from "antd";
import React, { FC, useCallback } from "react";
import { LoginModal } from "./LoginModal";

interface Props extends ButtonProps {
  redirectToOnboarding?: boolean;
  onAuthedWithWallet?(): void;
}

export const LoginButton: FC<Props> = ({
  className,
  redirectToOnboarding,
  onAuthedWithWallet,
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
  const handleAuthedWithWallet = useCallback(() => {
    onAuthedWithWallet?.();
    modalVisible.toggleOff();
  }, [onAuthedWithWallet, modalVisible]);
  return (
    <>
      <Button {...props} onClick={handleClick} />
      <LoginModal
        toggle={modalVisible}
        redirectToOnboarding={redirectToOnboarding}
        onAuthedWithWallet={handleAuthedWithWallet}
      />
    </>
  );
};
