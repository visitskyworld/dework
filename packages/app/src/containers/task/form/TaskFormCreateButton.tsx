import { LocalStorage } from "@dewo/app/util/LocalStorage";
import { Button, Popconfirm } from "antd";
import React, { FC, useCallback, useMemo } from "react";

const key = "TaskFormCreateButton.v1.ContinueWithoutSkills";

interface Props {
  loading: boolean;
  showSkillsPrompt: boolean;
  onSubmit(): void;
}

export const TaskFormCreateButton: FC<Props> = ({
  loading,
  showSkillsPrompt,
  onSubmit,
}) => {
  const button = (
    <Button
      type="primary"
      htmlType="submit"
      size="large"
      block
      loading={loading}
      children="Create"
    />
  );

  const dontShowAgain = useCallback(() => {
    LocalStorage.setItem(key, String(true));
    onSubmit();
  }, [onSubmit]);

  const skip = useMemo(() => !!LocalStorage.getItem(key), []);
  if (!showSkillsPrompt || skip) return button;
  return (
    <Popconfirm
      title="Adding skills to the task will make it more likely to find contributors. Are you sure you don't want to add skills?"
      okText="Continue without"
      cancelText="Don't show again"
      onConfirm={onSubmit}
      onCancel={dontShowAgain}
    >
      {button}
    </Popconfirm>
  );
};
