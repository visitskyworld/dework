import {
  useApolloClient,
  useLazyQuery,
  useMutation,
  useQuery,
  WatchQueryFetchPolicy,
} from "@apollo/client";
import * as Mutations from "@dewo/app/graphql/mutations";
import * as Queries from "@dewo/app/graphql/queries";
import {
  CreateTaskApplicationInput,
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
  User,
  UpdateTaskRewardInput,
  TaskReward,
  UpdateTaskInput,
  GetTasksInput,
  GetTasksQuery,
  GetTasksQueryVariables,
  TaskReactionInput,
  CreateTaskReactionMutation,
  CreateTaskReactionMutationVariables,
  DeleteTaskReactionMutation,
  DeleteTaskReactionMutationVariables,
  GetTaskReactionUsersQuery,
  GetTaskReactionUsersQueryVariables,
  OrganizationTag,
  DeleteTaskApplicationInput,
  CreateTaskApplicationMutation,
  CreateTaskApplicationMutationVariables,
  DeleteTaskApplicationMutation,
  DeleteTaskApplicationMutationVariables,
  TaskStatus,
  CreateTaskSubmissionInput,
  CreateTaskSubmissionMutation,
  CreateTaskSubmissionMutationVariables,
  UpdateTaskSubmissionInput,
  UpdateTaskSubmissionMutation,
  UpdateTaskSubmissionMutationVariables,
  CreateTaskDiscordLinkMutation,
  CreateTaskDiscordLinkMutationVariables,
  TaskWithOrganization,
  CreateTaskInput,
} from "@dewo/app/graphql/types";
import _ from "lodash";
import { useCallback, useMemo } from "react";
import { formatFixed, parseFixed } from "@ethersproject/bignumber";
import { useOrganizationCoreTeam } from "../organization/hooks";
import { useProject } from "../project/hooks";
import { TaskRewardFormValues } from "./form/TaskRewardFormFields";
import { TaskFormValues } from "./form/TaskForm";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";

export const toTaskReward = (
  reward: TaskRewardFormValues | undefined
): UpdateTaskRewardInput | null => {
  if (!reward?.amount || !reward?.token || !reward?.trigger) return null;
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
  [formatFixed(reward.amount, reward.token.exp), reward.token.symbol].join(" ");

export const formatTaskRewardAsUSD = (
  reward: TaskReward
): string | undefined => {
  if (!reward.token.usdPrice) return undefined;

  const amount = Number(formatFixed(reward.amount, reward.token.exp));
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount * reward.token.usdPrice);
};

export const calculateTaskRewardAsUSD = (
  reward: TaskReward | undefined
): number | undefined => {
  if (!reward?.token.usdPrice) return undefined;
  const amount = Number(formatFixed(reward.amount, reward.token.exp));
  return amount * reward.token.usdPrice;
};

export function useAddTaskToApolloCache(): (task: Task) => void {
  const apolloClient = useApolloClient();
  return useCallback(
    (task: Task) => {
      const isDoneAssignedAndHasReward =
        !!task.assignees.length &&
        !!task.reward &&
        task.status === TaskStatus.DONE;
      if (!task.parentTaskId || isDoneAssignedAndHasReward) {
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
      }

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

export function useCreateTaskFromFormValues(): (
  values: TaskFormValues,
  projectId: string
) => Promise<Task> {
  const { user } = useAuthContext();
  const createTask = useCreateTask();
  const createTaskReaction = useCreateTaskReaction();
  return useCallback(
    async ({ subtasks, reward, ...values }, projectId) => {
      const task = await createTask({
        ...values,
        projectId,
        dueDate: values.dueDate?.toISOString(),
        reward: !!reward ? toTaskReward(reward) : undefined,
      });
      if (values.status === TaskStatus.BACKLOG) {
        await createTaskReaction({
          taskId: task.id,
          reaction: ":arrow_up_small:",
        });
      }

      for (const subtask of subtasks ?? []) {
        await createTask({
          parentTaskId: task.id,
          name: subtask.name,
          ownerId: user?.id,
          assigneeIds: subtask.assigneeIds,
          status: subtask.status,
          tagIds: [],
          projectId: task.projectId,
        });
      }

      return task;
    },
    [createTask, createTaskReaction, user]
  );
}

export function useUpdateTask(): (
  input: UpdateTaskInput,
  task?: Task
) => Promise<Task> {
  const [mutation] = useMutation<
    UpdateTaskMutation,
    UpdateTaskMutationVariables
  >(Mutations.updateTask);
  return useCallback(
    async (input, task) => {
      const res = await mutation({
        variables: { input },
        optimisticResponse: !!task
          ? {
              // TODO: find a better way to merge optimistic task updates
              task: _.merge(
                {},
                task,
                _.pickBy(_.omit(input, ["reward"]), _.identity)
              ),
            }
          : undefined,
      });

      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.task;
    },
    [mutation]
  );
}

export function useCreateTaskDiscordLink(): (
  taskId: string
) => Promise<string> {
  const [mutation] = useMutation<
    CreateTaskDiscordLinkMutation,
    CreateTaskDiscordLinkMutationVariables
  >(Mutations.createTaskDiscordLink);
  return useCallback(
    async (taskId) => {
      const res = await mutation({ variables: { taskId } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.link;
    },
    [mutation]
  );
}

export function useCreateTaskApplication(): (
  input: CreateTaskApplicationInput
) => Promise<Task> {
  const [mutation] = useMutation<
    CreateTaskApplicationMutation,
    CreateTaskApplicationMutationVariables
  >(Mutations.createTaskApplication);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.application.task;
    },
    [mutation]
  );
}

export function useDeleteTaskApplication(): (
  input: DeleteTaskApplicationInput
) => Promise<Task> {
  const [mutation] = useMutation<
    DeleteTaskApplicationMutation,
    DeleteTaskApplicationMutationVariables
  >(Mutations.deleteTaskApplication);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.task;
    },
    [mutation]
  );
}

export function useCreateTaskSubmission(): (
  input: CreateTaskSubmissionInput
) => Promise<void> {
  const [mutation] = useMutation<
    CreateTaskSubmissionMutation,
    CreateTaskSubmissionMutationVariables
  >(Mutations.createTaskSubmission);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
    },
    [mutation]
  );
}

export function useUpdateTaskSubmission(): (
  input: UpdateTaskSubmissionInput
) => Promise<void> {
  const [mutation] = useMutation<
    UpdateTaskSubmissionMutation,
    UpdateTaskSubmissionMutationVariables
  >(Mutations.updateTaskSubmission);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
    },
    [mutation]
  );
}

export function useCreateTaskReaction(): (
  input: TaskReactionInput
) => Promise<void> {
  const [mutation] = useMutation<
    CreateTaskReactionMutation,
    CreateTaskReactionMutationVariables
  >(Mutations.createTaskReaction);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
    },
    [mutation]
  );
}

export function useDeleteTaskReaction(): (
  input: TaskReactionInput
) => Promise<void> {
  const [mutation] = useMutation<
    DeleteTaskReactionMutation,
    DeleteTaskReactionMutationVariables
  >(Mutations.deleteTaskReaction);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
    },
    [mutation]
  );
}

export function useDeleteTask(): (taskId: string) => Promise<void> {
  const [deleteTask] = useMutation<
    DeleteTaskMutation,
    DeleteTaskMutationVariables
  >(Mutations.deleteTask);
  return useCallback(
    async (taskId) => {
      const res = await deleteTask({
        variables: { taskId },
        optimisticResponse: {
          task: {
            __typename: "Task",
            id: taskId,
            deletedAt: new Date().toISOString(),
          },
        },
      });

      if (!res.data) throw new Error(JSON.stringify(res.errors));
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

export function useGenerateRandomTagColor(
  existingTags: TaskTag[] | OrganizationTag[]
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
  taskId: string | undefined,
  fetchPolicy?: WatchQueryFetchPolicy
): GetTaskQuery["task"] | undefined {
  const { data } = useQuery<GetTaskQuery, GetTaskQueryVariables>(Queries.task, {
    variables: { taskId: taskId! },
    skip: !taskId,
    fetchPolicy,
  });
  const task = data?.task ?? undefined;
  if (!task || task.id !== taskId) return undefined;
  return task;
}

export function useLazyTaskReactionUsers(taskId: string) {
  return useLazyQuery<
    GetTaskReactionUsersQuery,
    GetTaskReactionUsersQueryVariables
  >(Queries.taskReactionUsers, { variables: { taskId } });
}

export function useTasks(
  input: GetTasksInput,
  skip: boolean = false
): TaskWithOrganization[] | undefined {
  const { data } = useQuery<GetTasksQuery, GetTasksQueryVariables>(
    Queries.tasks,
    { variables: { input }, skip }
  );
  return data?.tasks ?? undefined;
}

export function useListenToTasks() {
  // const skip = typeof window === "undefined";
  // const addTaskToApolloCache = useAddTaskToApolloCache();
  // useSubscription<TaskCreatedSubscription>(Subscriptions.taskCreated, {
  //   skip,
  //   onSubscriptionData(options) {
  //     const task = options.subscriptionData.data?.task;
  //     if (!!task) addTaskToApolloCache(task);
  //   },
  // });
  // useSubscription<TaskUpdatedSubscription>(Subscriptions.taskUpdated, {
  //   skip,
  //   onSubscriptionData(options) {
  //     const task = options.subscriptionData.data?.task;
  //     if (!!task) addTaskToApolloCache(task);
  //   },
  // });
  // useSubscription(Subscriptions.paymentUpdated, { skip });
  // useSubscription(Subscriptions.taskRewardUpdated, { skip });
}

export function useTaskFormUserOptions(
  projectId: string,
  additionalUsers: User[] | undefined
): User[] | undefined {
  const { project } = useProject(projectId);
  const organizationCoreTeam = useOrganizationCoreTeam(project?.organizationId);

  return useMemo(() => {
    const projectUsers = project?.members.map((m) => m.user);
    return _.uniqBy(
      [
        ...(projectUsers ?? []),
        ...organizationCoreTeam,
        ...(additionalUsers ?? []),
      ],
      (u) => u.id
    );
  }, [project, additionalUsers, organizationCoreTeam]);
}
