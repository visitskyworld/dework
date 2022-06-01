import { Tooltip } from "antd";
import React, { FC, useCallback } from "react";
import * as Icons from "@ant-design/icons";
import { TooltipPropsWithTitle } from "antd/lib/tooltip";

import { useAmplitude } from "../util/analytics/AmplitudeContext";

interface Props extends TooltipPropsWithTitle {
  marginLeft?: number;
  readMoreUrl?: string;
  name?: string;
}

export const QuestionmarkTooltip: FC<Props> = ({
  readMoreUrl,
  marginLeft,
  children,
  title,
  name,
  ...tooltipProps
}) => {
  const { logEvent } = useAmplitude();
  const handleEventLogging = useCallback(() => {
    if (!!name) {
      logEvent(`Questionmark tooltip shown: ${name}`);
    }
  }, [logEvent, name]);

  return (
    <Tooltip
      onVisibleChange={handleEventLogging}
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
};
