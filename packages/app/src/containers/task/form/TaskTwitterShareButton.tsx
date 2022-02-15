import React, { FC } from "react";
import { TaskDetails } from "@dewo/app/graphql/types";
import { FormSection } from "@dewo/app/components/FormSection";
import { Button } from "antd";
import { TwitterOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { Constants } from "@dewo/app/util/constants";
interface Props {
  task: TaskDetails;
}

export const TaskTwitterShareButton: FC<Props> = ({ task }) => {
  const router = useRouter();
  const url = encodeURIComponent(`${Constants.APP_URL}${router.asPath}`);
  return (
    <FormSection label="Twitter Share" className="mb-3">
      <Button
        type="primary"
        target="_blank"
        size="small"
        icon={<TwitterOutlined />}
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
          task.name
        )}:&url=${url}${
          task.tags?.length
            ? `&hashtags=${task.tags.map((tag) => tag.label).toString()}`
            : ""
        } `}
      >
        Share task on twitter
      </Button>
    </FormSection>
  );
};
