import React, { FC } from "react";
import { TaskDetails } from "@dewo/app/graphql/types";
import { Button } from "antd";
import { TwitterOutlined } from "@ant-design/icons";
import slugify from "slugify";
import * as qs from "query-string";

interface Props {
  task: TaskDetails;
}

export const TaskTwitterShareButton: FC<Props> = ({ task }) => {
  const text = `🚨 Bounty Call 🚨\n\n${task.name}\n\nCheck out the details👇\n${task.permalink}\n`;
  const hashtags = task.tags
    .map((t) => slugify(t.label))
    .concat("dework")
    .join();
  return (
    <Button
      target="_blank"
      type="ghost"
      className="dewo-twitter-btn"
      size="small"
      icon={<TwitterOutlined />}
      href={`https://twitter.com/intent/tweet?${qs.stringify({
        text,
        hashtags,
      })}`}
    >
      Share on Twitter
    </Button>
  );
};
