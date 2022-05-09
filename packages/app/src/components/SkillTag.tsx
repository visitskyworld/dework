import { Tag, TagProps, Tooltip } from "antd";
import React, { FC } from "react";
import { Skill } from "../graphql/types";

interface Props extends TagProps {
  skill: Skill;
  mode?: "emoji" | "default";
}

export const SkillTag: FC<Props> = ({
  skill,
  mode = "default",
  ...tagProps
}) => {
  if (mode === "emoji") {
    return (
      <Tooltip title={skill.name} placement="bottom">
        <Tag {...tagProps}>{skill.emoji}</Tag>
      </Tooltip>
    );
  }

  return (
    <Tag {...tagProps}>
      <span style={{ paddingRight: 8 }}>{skill.emoji}</span>
      {skill.name}
    </Tag>
  );
};
