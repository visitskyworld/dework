import { Typography } from "antd";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import React, { FC } from "react";

interface Props {
  usps: string[];
}

export const OnboardingUSPs: FC<Props> = ({ usps }) => {
  const breakpoint = useBreakpoint();
  const TypographyComponent = breakpoint.xs
    ? Typography.Paragraph
    : Typography.Title;
  return (
    <>
      <div style={{ flex: 1 }} />
      <div
        className="mx-auto"
        style={{ flex: 1, paddingTop: 20, paddingBottom: 20 }}
      >
        {usps.map((usp) => (
          <TypographyComponent
            level={5}
            className="mx-auto w-full"
            style={{ whiteSpace: "break-spaces", fontWeight: 500 }}
          >
            {usp}
          </TypographyComponent>
        ))}
      </div>
    </>
  );
};
