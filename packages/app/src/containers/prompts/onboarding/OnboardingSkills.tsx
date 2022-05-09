import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { useRunning } from "@dewo/app/util/hooks";
import { Button, Space, Tag, Typography } from "antd";
import React, { FC } from "react";
import { UserSkillSelect } from "../../user/UserSkillSelect";

interface Props {
  onNext(): Promise<void>;
}

export const OnboardingSkills: FC<Props> = ({ onNext }) => {
  const hasSkills = !!useAuthContext().user?.skills.length;
  const [handleNext, loadingNext] = useRunning(onNext);
  return (
    <>
      <Tag
        color="green"
        style={{ alignSelf: "center", marginBottom: 8, marginRight: 0 }}
      >
        New
      </Tag>
      <Typography.Title level={2} style={{ textAlign: "center" }}>
        Skills
      </Typography.Title>
      <Typography.Paragraph
        type="secondary"
        style={{ textAlign: "center", fontSize: "130%" }}
      >
        Select your skills and Dework will show you matching bounties and tasks
      </Typography.Paragraph>
      <UserSkillSelect style={{ width: "100%" }} placeholder="Select skills" />
      <div style={{ flex: 1 }} />
      <Space direction="vertical" size="small" align="center">
        {hasSkills && (
          <Button
            size="large"
            type="primary"
            className="mx-auto"
            loading={loadingNext}
            name="Onboarding Skills: next"
            onClick={handleNext}
          >
            Next
          </Button>
        )}
        <Button
          type="text"
          className="text-secondary"
          name="Onboarding Skills: skip"
          onClick={onNext}
        >
          Not now
        </Button>
      </Space>
    </>
  );
};
