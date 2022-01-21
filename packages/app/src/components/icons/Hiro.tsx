import React from "react";
import Icon from "@ant-design/icons";

const HiroSvg = () => (
  <svg
    width="1rem"
    height="1rem"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24 7.61715H16.8262L21.8641 0H18.0554L11.99 9.18883L5.94458 0H2.1361L7.1738 7.61715H0V10.5592H24V7.61715ZM16.6852 16.2821L21.7834 24H17.9749L11.99 14.9319L6.00509 24H2.21678L7.31499 16.3021H0V13.3802H24V16.2821H16.6852Z"
      fill="currentColor"
    />
  </svg>
);

export const HiroIcon = (props: any) => <Icon component={HiroSvg} {...props} />;
