import { useMutation, useQuery, WatchQueryFetchPolicy } from "@apollo/client";
import * as Mutations from "@dewo/app/graphql/mutations";
import * as Queries from "@dewo/app/graphql/queries";
import {
  UserTasksQuery,
  UserTasksQueryVariables,
  Task,
  UpdateUserInput,
  UpdateUserMutation,
  UpdateUserMutationVariables,
  User,
  UserProfileQuery,
  UserProfileQueryVariables,
  UserProfile,
  UpdateUserOnboardingInput,
  UserOnboarding,
  UpdateUserOnboardingMutation,
  UpdateUserOnboardingMutationVariables,
  UserProfileByUsernameQuery,
  UserProfileByUsernameQueryVariables,
  UserRolesQuery,
  UserRolesQueryVariables,
  UpdateUserRoleInput,
  UpdateUserRoleMutation,
  UpdateUserRoleMutationVariables,
} from "@dewo/app/graphql/types";
import { useCallback } from "react";
import { useListenToTasks } from "../task/hooks";
import {
  SetUserDetailInput,
  SetUserDetailMutation,
  SetUserDetailMutationVariables,
  SetUserDetailMutation_organization,
} from "../../graphql/types";

export function useUpdateUser(): (input: UpdateUserInput) => Promise<User> {
  const [mutation] = useMutation<
    UpdateUserMutation,
    UpdateUserMutationVariables
  >(Mutations.updateUser);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.user;
    },
    [mutation]
  );
}

export function useUpdateUserOnboarding(): (
  input: UpdateUserOnboardingInput
) => Promise<UserOnboarding> {
  const [mutation] = useMutation<
    UpdateUserOnboardingMutation,
    UpdateUserOnboardingMutationVariables
  >(Mutations.updateUserOnboarding);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data.onboarding;
    },
    [mutation]
  );
}

export function useUpdateUserDetail(): (
  input: SetUserDetailInput
) => Promise<SetUserDetailMutation_organization> {
  const [mutation] = useMutation<
    SetUserDetailMutation,
    SetUserDetailMutationVariables
  >(Mutations.setUserDetail);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.organization;
    },
    [mutation]
  );
}

export function useUser(userId: string): UserProfile | undefined {
  const { data } = useQuery<UserProfileQuery, UserProfileQueryVariables>(
    Queries.userProfile,
    { variables: { id: userId } }
  );
  return data?.user;
}

export function useUserByUsername(username: string): UserProfile | undefined {
  const { data } = useQuery<
    UserProfileByUsernameQuery,
    UserProfileByUsernameQueryVariables
  >(Queries.userProfileByUsername, {
    variables: { username },
  });
  return data?.user;
}

export function useUserRoles(
  userId: string
): UserRolesQuery["user"] | undefined {
  const { data } = useQuery<UserRolesQuery, UserRolesQueryVariables>(
    Queries.userRoles,
    { variables: { userId } }
  );
  return data?.user;
}

export function useUserTasks(
  userId: string | undefined,
  fetchPolicy?: WatchQueryFetchPolicy
): Task[] | undefined {
  const { data } = useQuery<UserTasksQuery, UserTasksQueryVariables>(
    Queries.userTasks,
    { variables: { id: userId! }, fetchPolicy, skip: !userId }
  );
  useListenToTasks();
  return data?.user.tasks;
}

export function useUpdateOrganizationHidden(): (
  input: UpdateUserRoleInput
) => Promise<void> {
  const [mutation] = useMutation<
    UpdateUserRoleMutation,
    UpdateUserRoleMutationVariables
  >(Mutations.updateUserRole);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
    },
    [mutation]
  );
}
