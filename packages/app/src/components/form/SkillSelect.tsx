import React, { FC, useMemo } from "react";
import { Select, SelectProps } from "antd";
import { useSkills } from "@dewo/app/containers/skills/hooks";
import _ from "lodash";
import { SkillTag } from "../SkillTag";

export const SkillSelect: FC<SelectProps> = (props) => {
  const skills = useSkills();
  const skillById = useMemo(() => _.keyBy(skills, (s) => s.id), [skills]);
  return (
    <Select
      mode="multiple"
      loading={!skills}
      optionFilterProp="label"
      tagRender={(props) => (
        <SkillTag {...props} skill={skillById[props.value as string]} />
      )}
      {...props}
    >
      {skills?.map((skill) => (
        <Select.Option key={skill.id} value={skill.id} label={skill.name}>
          <span style={{ paddingRight: 8 }}>{skill.emoji}</span>
          {skill.name}
        </Select.Option>
      ))}
    </Select>
  );
};
