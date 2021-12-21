import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import * as Mutations from "@dewo/app/graphql/mutations";
import * as Queries from "@dewo/app/graphql/queries";
import {
  CreateTaskInput,
  CreateTaskMutation,
  CreateTaskMutationVariables,
  CreateTaskTagInput,
  CreateTaskTagMutation,
  CreateTaskTagMutationVariables,
  DeleteTaskMutation,
  DeleteTaskMutationVariables,
  GetProjectTasksQuery,
  GetProjectTasksQueryVariables,
  GetTaskQuery,
  GetTaskQueryVariables,
  Task,
  TaskTag,
  UpdateTaskMutation,
  UpdateTaskMutationVariables,
  UserTasksQuery,
  UserTasksQueryVariables,
  ClaimTaskMutation,
  ClaimTaskMutationVariables,
  UnclaimTaskMutation,
  UnclaimTaskMutationVariables,
  User,
  UpdateTaskRewardInput,
  TaskReward,
  UpdateTaskInput,
} from "@dewo/app/graphql/types";
import _ from "lodash";
import { useCallback, useMemo } from "react";
import { formatFixed, parseFixed } from "@ethersproject/bignumber";
import { useOrganization } from "../organization/hooks";
import { useProject } from "../project/hooks";
import { TaskRewardFormValues } from "./TaskRewardFormFields";
import { TaskFormValues } from "./TaskForm";

export const toTaskReward = (
  reward: TaskRewardFormValues | undefined
): UpdateTaskRewardInput | undefined => {
  if (!reward?.amount || !reward?.token || !reward?.trigger) return undefined;
  return {
    amount: parseFixed(String(reward.amount), reward.token.exp).toString(),
    tokenId: reward.token.id,
    trigger: reward.trigger,
  };
};

export const toTaskRewardFormValues = (
  reward: TaskReward | undefined
): TaskRewardFormValues | undefined => {
  if (!reward) return undefined;
  return {
    amount: Number(formatFixed(reward.amount, reward.token.exp)),
    networkId: reward.token.networkId,
    token: reward.token,
    trigger: reward.trigger,
  };
};

export const formatTaskReward = (reward: TaskReward) =>
  [formatFixed(reward.amount, reward.token.exp), reward.token.name].join(" ");

export function useAddTaskToApolloCache(): (task: Task) => void {
  const apolloClient = useApolloClient();
  return useCallback(
    (task: Task) => {
      try {
        const data = apolloClient.readQuery<
          GetProjectTasksQuery,
          GetProjectTasksQueryVariables
        >({
          query: Queries.projectTasks,
          variables: { projectId: task.projectId },
        });

        if (!!data && !data.project.tasks.some((t) => t.id === task.id)) {
          apolloClient.writeQuery({
            query: Queries.projectTasks,
            variables: { projectId: task.projectId },
            data: {
              project: {
                ...data.project,
                tasks: [task, ...data.project.tasks],
              },
            },
          });
        }
      } catch {}

      task.assignees.forEach((user) => {
        try {
          const data = apolloClient.readQuery<
            UserTasksQuery,
            UserTasksQueryVariables
          >({
            query: Queries.userTasks,
            variables: { userId: user.id },
          });

          if (!!data && !data.user.tasks.some((t) => t.id === task.id)) {
            apolloClient.writeQuery({
              query: Queries.userTasks,
              variables: { userId: user.id },
              data: {
                user: {
                  ...data.user,
                  tasks: [task, ...data.user.tasks],
                },
              },
            });
          }
        } catch {}
      });
    },
    [apolloClient]
  );
}

export function useCreateTask(): (input: CreateTaskInput) => Promise<Task> {
  const [mutation] = useMutation<
    CreateTaskMutation,
    CreateTaskMutationVariables
  >(Mutations.createTask);
  const addTaskToApolloCache = useAddTaskToApolloCache();
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });

      if (!res.data) throw new Error(JSON.stringify(res.errors));
      addTaskToApolloCache(res.data.task);
      return res.data.task;
    },
    [mutation, addTaskToApolloCache]
  );
}

export function useUpdateTask(): (
  values: TaskFormValues,
  task: Task
) => Promise<Task> {
  const [mutation] = useMutation<
    UpdateTaskMutation,
    UpdateTaskMutationVariables
  >(Mutations.updateTask);
  return useCallback(
    async (values, task) => {
      const input: UpdateTaskInput = {
        id: task.id,
        ...values,
        reward: !!values.reward ? toTaskReward(values.reward) : undefined,
      };
      const res = await mutation({
        variables: { input },
        // optimisticResponse: {
        //   task: { ...task, ...input } as Task,
        // },
      });

      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.task;
    },
    [mutation]
  );
}

export function useClaimTask(): (task: Task) => Promise<Task> {
  const { user } = useAuthContext();
  const [mutation] = useMutation<ClaimTaskMutation, ClaimTaskMutationVariables>(
    Mutations.claimTask
  );
  return useCallback(
    async (task) => {
      const res = await mutation({
        variables: { taskId: task.id },
        optimisticResponse: {
          task: { ...task, assignees: [...task.assignees, user] } as Task,
        },
      });

      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.task;
    },
    [mutation, user]
  );
}

export function useUnclaimTask(): (task: Task) => Promise<Task> {
  const { user } = useAuthContext();
  const [mutation] = useMutation<
    UnclaimTaskMutation,
    UnclaimTaskMutationVariables
  >(Mutations.unclaimTask);
  return useCallback(
    async (task) => {
      const res = await mutation({
        variables: { taskId: task.id },
        optimisticResponse: {
          task: {
            ...task,
            assignees: task.assignees.filter((a) => a.id !== user?.id),
          } as Task,
        },
      });

      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.task;
    },
    [mutation, user]
  );
}

export function useDeleteTask(): (task: Task) => Promise<Task> {
  const [deleteTask] = useMutation<
    DeleteTaskMutation,
    DeleteTaskMutationVariables
  >(Mutations.deleteTask);
  return useCallback(
    async (task) => {
      const res = await deleteTask({
        variables: { taskId: task.id },
        optimisticResponse: {
          task: { ...task, deletedAt: new Date().toISOString() },
        },
      });

      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.task;
    },
    [deleteTask]
  );
}

export function useCreateTaskTag(): (
  input: CreateTaskTagInput
) => Promise<TaskTag> {
  const [createTaskTag] = useMutation<
    CreateTaskTagMutation,
    CreateTaskTagMutationVariables
  >(Mutations.createTaskTag);
  return useCallback(
    async (input) => {
      const res = await createTaskTag({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.taskTag;
    },
    [createTaskTag]
  );
}

export function useGenerateRandomTaskTagColor(
  existingTags: TaskTag[]
): () => string {
  return useCallback(() => {
    const colors = [
      "red",
      "green",
      "gold",
      "geekblue",

      "volcano",
      "cyan",
      "yellow",
      "purple",

      "orange",
      "blue",
      "lime",
      "magenta",
    ];

    const unusedColors = colors.filter(
      (color) => !existingTags.some((tag) => tag.color === color)
    );
    if (!!unusedColors.length) return unusedColors[0];
    return colors[Math.floor(Math.random() * colors.length)];
  }, [existingTags]);
}

export function useTask(
  taskId: string | undefined
): GetTaskQuery["task"] | undefined {
  const { data } = useQuery<GetTaskQuery, GetTaskQueryVariables>(Queries.task, {
    variables: { taskId: taskId! },
    skip: !taskId,
  });
  return data?.task ?? undefined;
}

export function useListenToTasks() {
  // TODO(fant): reenable this once we've moved away from Cloud Run
  // const addTaskToApolloCache = useAddTaskToApolloCache();
  // useSubscription<TaskCreatedSubscription>(Subscriptions.taskCreated, {
  //   onSubscriptionData(options) {
  //     const task = options.subscriptionData.data?.task;
  //     if (!!task) addTaskToApolloCache(task);
  //   },
  // });
  // useSubscription<TaskUpdatedSubscription>(Subscriptions.taskUpdated, {
  //   onSubscriptionData(options) {
  //     const task = options.subscriptionData.data?.task;
  //     if (!!task) addTaskToApolloCache(task);
  //   },
  // });
}

export function useTaskFormUserOptions(
  projectId: string,
  additionalUsers: User[] | undefined
): User[] | undefined {
  const project = useProject(projectId);
  const organization = useOrganization(project?.organizationId);
  return useMemo(() => {
    if (!organization) {
      return additionalUsers ?? [];
    }

    const orgUsers = organization.members.map((m) => m.user);
    if (!additionalUsers) return orgUsers;
    return _.uniqBy([...orgUsers, ...additionalUsers], (u) => u.id);
  }, [organization, additionalUsers]);
}
