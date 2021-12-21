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
} from "@dewo/app/graphql/types";
import { useCallback } from "react";
import { useListenToTasks } from "../task/hooks";
import { SetUserDetailMutation_detail } from "../../graphql/types";
import {
  SetUserDetailInput,
  SetUserDetailMutation,
  SetUserDetailMutationVariables,
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

export function useUpdateUserDetail(): (
  input: SetUserDetailInput
) => Promise<SetUserDetailMutation_detail> {
  const [mutation] = useMutation<
    SetUserDetailMutation,
    SetUserDetailMutationVariables
  >(Mutations.setUserDetail);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.detail;
    },
    [mutation]
  );
}

export function useUser(userId: string): UserProfile | undefined {
  const { data } = useQuery<UserProfileQuery, UserProfileQueryVariables>(
    Queries.userProfile,
    {
      variables: { userId },
    }
  );
  return data?.user;
}

export function useUserTasks(
  userId: string,
  fetchPolicy?: WatchQueryFetchPolicy
): Task[] | undefined {
  const { data } = useQuery<UserTasksQuery, UserTasksQueryVariables>(
    Queries.userTasks,
    { variables: { userId }, fetchPolicy }
  );
  useListenToTasks();
  return data?.user.tasks;
}
