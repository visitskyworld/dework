import React, { FC } from "react";
import { TaskDetails } from "@dewo/app/graphql/types";
import { FormSection } from "@dewo/app/components/FormSection";
import { Button } from "antd";
import { TwitterOutlined } from "@ant-design/icons";
interface Props {
  task: TaskDetails;
}

export const TaskTwitterShareButton: FC<Props> = ({ task }) => (
  <FormSection label="Twitter Share" className="mb-3">
    <Button
      type="primary"
      target="_blank"
      className="dewo-twitter-btn"
      size="small"
      icon={<TwitterOutlined />}
      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
        task.name
      )}:&url=${encodeURIComponent(task.permalink)}${
        task.tags?.length
          ? `&hashtags=${task.tags.map((tag) => tag.label).toString()}`
          : ""
      } `}
    >
      Share task on twitter
    </Button>
  </FormSection>
);
