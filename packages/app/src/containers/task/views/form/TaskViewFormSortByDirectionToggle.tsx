import { TaskViewSortByDirection } from "@dewo/app/graphql/types";
import { Button, Typography } from "antd";
import React, { FC, useCallback } from "react";

interface Props {
  value?: TaskViewSortByDirection;
  onChange?(value: TaskViewSortByDirection): void;
}

export const TaskViewFormSortByDirectionToggle: FC<Props> = ({
  value,
  onChange,
}) => {
  const toggle = useCallback(
    () =>
      onChange?.(
        value === TaskViewSortByDirection.ASC
          ? TaskViewSortByDirection.DESC
          : TaskViewSortByDirection.ASC
      ),
    [value, onChange]
  );
  return (
    <Button
      style={{ width: 32, paddingLeft: 0, paddingRight: 0 }}
      children={
        <Typography.Text className="ant-typography-caption">
          {value === TaskViewSortByDirection.ASC ? "ASC" : "DESC"}
        </Typography.Text>
      }
      onClick={toggle}
    />
  );
};
