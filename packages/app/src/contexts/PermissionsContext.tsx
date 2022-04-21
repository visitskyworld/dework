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
  PermissionsQuery,
  PermissionsQueryVariables,
  Project,
  Rule,
  Task,
  TaskApplication,
  TaskReaction,
  TaskSection,
  TaskSubmission,
  TaskTag,
  TaskView,
} from "../graphql/types";
import { useQuery } from "@apollo/client";
import { AtLeast } from "../types/general";
import { useOrganizationBySlug } from "../containers/organization/hooks";
import { useRouter } from "next/router";
import { useTask } from "../containers/task/hooks";

type AbilityAction = "create" | "read" | "update" | "delete" | "submit"; //  | "claimTask";
type AbilitySubject =
  | "Task"
  | "ProjectSection"
  | "Organization"
  | "TaskApplication"
  | "TaskReward"
  | "Role"
  | "Project"
  | Project
  | Organization
  | AtLeast<Project, "__typename" | "organizationId">
  | AtLeast<Rule, "__typename" | "permission">
  | AtLeast<Task, "__typename" | "status">
  | AtLeast<TaskTag, "__typename" | "projectId">
  | AtLeast<TaskView, "__typename" | "projectId">
  | AtLeast<TaskReaction, "__typename" | "userId">
  | AtLeast<TaskSection, "__typename" | "projectId">
  | AtLeast<TaskApplication, "__typename" | "userId">
  | AtLeast<TaskSubmission, "__typename" | "userId">;
type AbilityType = AbilityTuple<AbilityAction, AbilitySubject>;

const PermissionsContext = createContext<Ability<AbilityType>>(
  undefined as any
);
export const Can = createContextualCan(PermissionsContext.Consumer);

function useCurrentOrganizationId(): string | undefined {
  const organizationSlug = useRouter().query.organizationSlug as
    | string
    | undefined;
  const { organization } = useOrganizationBySlug(organizationSlug);

  const taskId = useRouter().query.taskId as string | undefined;
  const { task } = useTask(taskId);
  return organization?.id ?? task?.project?.organizationId;
}

export const PermissionsProvider: FC = ({ children }) => {
  const organizationId = useCurrentOrganizationId();
  const { data } = useQuery<PermissionsQuery, PermissionsQueryVariables>(
    Queries.permissions,
    { variables: { organizationId: organizationId! }, skip: !organizationId }
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

export function useDefaultAbility(organizationId: string | undefined): {
  ability: Ability<AbilityType> | undefined;
  refetch(): Promise<unknown>;
} {
  const { data, refetch } = useQuery<
    PermissionsQuery,
    PermissionsQueryVariables
  >(Queries.permissions, {
    variables: { organizationId: organizationId!, unauthed: true },
    skip: !organizationId,
  });
  const permissions = data?.permissions;
  const ability = useMemo(
    () =>
      !!permissions
        ? new Ability<AbilityType>(permissions as any, {
            detectSubjectType: (subject: any) => subject.__typename,
          })
        : undefined,
    [permissions]
  );
  return { ability, refetch };
}

export function usePermission(
  action: AbilityAction,
  subject: AbilitySubject | undefined,
  field?: string
): boolean | undefined {
  const fn = usePermissionFn();
  return useMemo(
    () => !!subject && fn(action, subject, field),
    [fn, action, subject, field]
  );
}

export type PermissionFn = (
  action: AbilityAction,
  subject: AbilitySubject,
  field?: string
) => boolean | undefined;

export function usePermissionFn(): PermissionFn {
  const ability = useContext(PermissionsContext);
  return useCallback(
    (action, subject, field) => {
      if (!ability) return undefined;
      if (ability.rules.length === 0) return undefined;

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
