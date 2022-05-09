import { Alert, AlertProps } from "antd";
import React, { FC, useCallback, useMemo } from "react";
import { useAmplitude } from "../util/analytics/AmplitudeContext";
import { isSSR } from "../util/isSSR";

interface Props extends AlertProps {
  name: string;
}

export const OnboardingAlert: FC<Props> = ({
  name,
  type = "info",
  ...alertProps
}) => {
  const key = `OnboardingAlert.v1.${name}`;
  const hidden = useMemo(() => isSSR || !!localStorage.getItem(key), [key]);

  const { logEvent } = useAmplitude();
  const handleClose = useCallback(() => {
    logEvent("Close onboarding alert", { name });
    localStorage.setItem(key, String(true));
  }, [key, logEvent, name]);

  if (hidden) return null;
  return <Alert closable onClose={handleClose} {...alertProps} />;
};
