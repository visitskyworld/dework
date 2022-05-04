import React, { FC } from "react";
import { Select, SelectProps } from "antd";
import { useSkills } from "@dewo/app/containers/skills/hooks";

export const SkillSelect: FC<SelectProps> = (props) => {
  const skills = useSkills();
  return (
    <Select mode="multiple" loading={!skills} {...props}>
      {skills?.map((skill) => (
        <Select.Option key={skill.id} value={skill.id} label={skill.name}>
          {skill.name}
        </Select.Option>
      ))}
    </Select>
  );
};
