import { deworkSocialLinks } from "@dewo/app/util/constants";
import { isSSR } from "@dewo/app/util/isSSR";
import { Alert } from "antd";
import React, { FC, useCallback, useMemo } from "react";

const key = "AddTokenModal.closedPaymentMethodPromptAlert2";

export const PaymentMethodEducationAlert: FC = () => {
  const shouldShow = useMemo(() => isSSR || !localStorage.getItem(key), []);
  const handleClose = useCallback(
    () => localStorage.setItem(key, String(true)),
    []
  );
  if (!shouldShow) return null;
  return (
    <Alert
      message={
        <>
          We support Gnosis Safe and other payment methods. <br />
          <a
            href={deworkSocialLinks.gitbook.payments}
            target="_blank"
            rel="noreferrer"
          >
            Read more
          </a>
        </>
      }
      type="info"
      showIcon
      closable
      onClose={handleClose}
      style={{ marginBottom: 12 }}
    />
  );
};
