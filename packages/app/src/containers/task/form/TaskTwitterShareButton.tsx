import React, { FC } from "react";
import { TaskDetails } from "@dewo/app/graphql/types";
import { FormSection } from "@dewo/app/components/FormSection";
import { Button } from "antd";
import { TwitterOutlined } from "@ant-design/icons";
import slugify from "slugify";
import * as qs from "query-string";

interface Props {
  task: TaskDetails;
}

export const TaskTwitterShareButton: FC<Props> = ({ task }) => {
  const text = [`🚨 Bounty Call 🚨`, task.name, "Check out the details👇"].join(
    "\n\n"
  );
  const hashtags = task.tags.map((t) => slugify(t.label)).join();
  return (
    <FormSection label="Twitter" className="mb-3">
      <Button
        type="primary"
        target="_blank"
        className="dewo-twitter-btn"
        size="small"
        icon={<TwitterOutlined />}
        href={`https://twitter.com/intent/tweet?${qs.stringify({
          text,
          hashtags,
          url: task.permalink,
        })}`}
      >
        Share on Twitter
      </Button>
    </FormSection>
  );
};
