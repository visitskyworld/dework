import { SkillTag } from "@dewo/app/components/SkillTag";
import { Row } from "antd";
import React, { FC, useCallback } from "react";
import { useSkills } from "../skills/hooks";

interface Props {
  value?: string[];
  onChange?(value: string[]): void;
}

export const SkillCloudInput: FC<Props> = ({ value: skillIds, onChange }) => {
  const skills = useSkills();
  const handleClick = useCallback(
    (skillId: string) =>
      onChange?.(
        !!skillIds?.includes(skillId)
          ? skillIds.filter((id) => id !== skillId)
          : [...(skillIds ?? []), skillId]
      ),
    [skillIds, onChange]
  );
  return (
    <Row gutter={[4, 8]} style={{ marginBottom: 16 }}>
      {skills?.map((skill) => {
        const selected = !!skillIds?.includes(skill.id);
        return (
          <SkillTag
            key={skill.id}
            skill={skill}
            color={selected ? "blue" : undefined}
            className="hover:cursor-pointer"
            style={{
              opacity: !!skillIds?.length && !selected ? 0.5 : undefined,
            }}
            onClick={() => handleClick(skill.id)}
          />
        );
      })}
    </Row>
  );
};
