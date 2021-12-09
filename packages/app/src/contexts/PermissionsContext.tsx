import * as Queries from "@dewo/app/graphql/queries";
import { useRouter } from "next/router";
import React, { createContext, FC, useContext, useMemo } from "react";
import { Ability, AbilityTuple } from "@casl/ability";
import { createContextualCan } from "@casl/react";
import {
  Organization,
  PermissionsQuery,
  PermissionsQueryVariables,
  Project,
  Task,
} from "../graphql/types";
import { useQuery } from "@apollo/client";

type AbilityAction = "create" | "read" | "update" | "delete";
type AbilitySubject =
  | "Task"
  | "Project"
  | "Organization"
  | "OrganizationMember"
  | Task
  | Project
  | Organization;
type AbilityType = AbilityTuple<AbilityAction, AbilitySubject>;

const PermissionsContext = createContext<Ability<AbilityType>>(
  undefined as any
);
export const Can = createContextualCan(PermissionsContext.Consumer);

export const PermissionsProvider: FC = ({ children }) => {
  const router = useRouter();

  const { data } = useQuery<PermissionsQuery, PermissionsQueryVariables>(
    Queries.permissions,
    {
      variables: {
        input: {
          projectId: router.query.projectId as string | undefined,
          organizationId: router.query.organizationId as string | undefined,
        },
      },
    }
  );
  const permissions = data?.me.permissions;
  const ability = useMemo(
    () =>
      new Ability<AbilityType>((permissions as any[]) ?? [], {
        detectSubjectType: (subject: any) => subject.__typename,
      }),
    [permissions]
  );

  return (
    <PermissionsContext.Provider value={ability}>
      {useMemo(() => children, [children])}
    </PermissionsContext.Provider>
  );
};

export function usePermission(
  action: AbilityAction,
  subject: AbilitySubject,
  field?: string
): boolean {
  const ability = useContext(PermissionsContext);
  return useMemo(() => {
    if (!ability) return false;

    // Inspired by ability.can
    // https://github.com/stalniy/casl/blob/7980e5aa95b88f6903015c58424b37e516de248a/packages/casl-ability/src/PureAbility.ts#L18-L35
    const subjectType = ability.detectSubjectType(subject);
    const rules = ability.rulesFor(action, subjectType, field);
    const rule = rules.find((rule) => rule.matchesConditions(subject));
    return !!rule && !rule.inverted;
  }, [ability, action, subject, field]);
}
