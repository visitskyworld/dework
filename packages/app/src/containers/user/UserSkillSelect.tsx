import { SkillSelect } from "@dewo/app/components/form/SkillSelect";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import { SelectProps } from "antd";
import React, { FC, useMemo } from "react";
import { useSetUserSkills } from "../skills/hooks";

export const UserSkillSelect: FC<SelectProps> = (props) => {
  const { user } = useAuthContext();
  const skillIds = useMemo(
    () => user?.skills.map((s) => s.id) ?? [],
    [user?.skills]
  );

  const setUserSkills = useSetUserSkills();
  return <SkillSelect {...props} value={skillIds} onChange={setUserSkills} />;
};
