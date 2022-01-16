import * as Queries from "@dewo/app/graphql/queries";
import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { Ability, AbilityTuple } from "@casl/ability";
import { createContextualCan } from "@casl/react";
import {
  Organization,
  OrganizationMember,
  PermissionsQuery,
  PermissionsQueryVariables,
  Project,
  ProjectMember,
  Task,
  TaskApplication,
} from "../graphql/types";
import { useQuery } from "@apollo/client";
import { useParseIdFromSlug } from "../util/uuid";
import { AtLeast } from "../types/general";

type AbilityAction = "create" | "read" | "update" | "delete" | "claimTask";
type AbilitySubject =
  | "Task"
  | "TaskTag"
  | "Project"
  | "Organization"
  | AtLeast<Task, "__typename" | "status">
  | Project
  | Organization
  | AtLeast<OrganizationMember, "__typename" | "role">
  | AtLeast<ProjectMember, "__typename" | "role">
  | AtLeast<TaskApplication, "__typename" | "userId">;
type AbilityType = AbilityTuple<AbilityAction, AbilitySubject>;

const PermissionsContext = createContext<Ability<AbilityType>>(
  undefined as any
);
export const Can = createContextualCan(PermissionsContext.Consumer);

export const PermissionsProvider: FC = ({ children }) => {
  const orgId = useParseIdFromSlug("organizationSlug");
  const projId = useParseIdFromSlug("projectSlug");

  const { data } = useQuery<PermissionsQuery, PermissionsQueryVariables>(
    Queries.permissions,
    {
      variables: { input: { projectId: projId, organizationId: orgId } },
    }
  );
  const permissions = data?.permissions;
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
  const fn = usePermissionFn();
  return useMemo(
    () => fn(action, subject, field),
    [fn, action, subject, field]
  );
}

export function usePermissionFn(): (
  action: AbilityAction,
  subject: AbilitySubject,
  field?: string
) => boolean {
  const ability = useContext(PermissionsContext);
  return useCallback(
    (action, subject, field) => {
      if (!ability) return false;

      // Inspired by ability.can
      // https://github.com/stalniy/casl/blob/7980e5aa95b88f6903015c58424b37e516de248a/packages/casl-ability/src/PureAbility.ts#L18-L35
      const subjectType = ability.detectSubjectType(subject);
      const rules = ability.rulesFor(action, subjectType, field);
      const rule = rules.find((rule) => rule.matchesConditions(subject));
      return !!rule && !rule.inverted;
    },
    [ability]
  );
}
