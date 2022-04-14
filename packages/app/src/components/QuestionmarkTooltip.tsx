import { Tooltip } from "antd";
import React, { FC } from "react";
import * as Icons from "@ant-design/icons";
import { TooltipPropsWithTitle } from "antd/lib/tooltip";

interface Props extends TooltipPropsWithTitle {
  marginLeft?: number;
  readMoreUrl?: string;
}

export const QuestionmarkTooltip: FC<Props> = ({
  readMoreUrl,
  marginLeft,
  children,
  title,
  ...tooltipProps
}) => (
  <Tooltip
    {...tooltipProps}
    title={
      !!readMoreUrl ? (
        <>
          {title}{" "}
          <a href={readMoreUrl} target="_blank" rel="noreferrer">
            Read More
          </a>
        </>
      ) : (
        title
      )
    }
  >
    {children}
    <Icons.QuestionCircleOutlined style={{ marginLeft }} />
  </Tooltip>
);
