import { useMutation, useQuery } from "@apollo/client";
import { setUserSkills } from "@dewo/app/graphql/mutations/skill";
import { getSkills } from "@dewo/app/graphql/queries/skill";
import {
  GetSkillsQuery,
  SetUserSkillsMutation,
  SetUserSkillsMutationVariables,
} from "@dewo/app/graphql/types";
import { useCallback } from "react";

export function useSkills() {
  const { data } = useQuery<GetSkillsQuery>(getSkills);
  return data?.skills;
}

export function useSetUserSkills(): (skillIds: string[]) => Promise<void> {
  const [mutation] = useMutation<
    SetUserSkillsMutation,
    SetUserSkillsMutationVariables
  >(setUserSkills);
  return useCallback(
    async (skillIds) => {
      const res = await mutation({ variables: { skillIds } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
    },
    [mutation]
  );
}
