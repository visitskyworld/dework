import {
  ApolloError,
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
  TaskReward,
  UpdateTaskInput,
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
  CreateTaskInput,
  UpdateTaskTagInput,
  UpdateTaskTagMutation,
  UpdateTaskTagMutationVariables,
  GetProjectQuery,
  GetProjectQueryVariables,
  GetOrganizationRolesQuery,
  GetOrganizationRolesQueryVariables,
  RulePermission,
  RoleWithRules,
  TaskGatingType,
} from "@dewo/app/graphql/types";
import _ from "lodash";
import { useCallback, useMemo } from "react";
import { formatFixed } from "@ethersproject/bignumber";
import { useOrganizationUsers } from "../organization/hooks";
import { useProject, useSetTaskGatingDefault } from "../project/hooks";
import { TaskFormValues } from "./form/types";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import {
  useCreateRule,
  useDeleteRule,
  useOrganizationRoles,
} from "../rbac/hooks";
import { getRule, hasRule } from "../rbac/util";
import { Constants } from "@dewo/app/util/constants";
import { toTaskReward } from "./form/util";
import { AtLeast } from "@dewo/app/types/general";

export const formatTaskReward = (
  reward: AtLeast<TaskReward, "amount" | "token">
) => {
  if (reward.peggedToUsd) {
    return [
      "$" +
        Number(formatFixed(reward.amount, Constants.NUM_DECIMALS_IN_USD_PEG)),
      "in",
      reward.token.symbol,
    ].join(" ");
  } else {
    return [
      Number(formatFixed(reward.amount, reward.token.exp)),
      reward.token.symbol,
    ].join(" ");
  }
};

export const formatTaskRewardAsUSD = (
  reward: TaskReward
): string | undefined => {
  if (!reward.token.usdPrice) return undefined;

  const amount = reward.peggedToUsd
    ? Number(formatFixed(reward.amount, Constants.NUM_DECIMALS_IN_USD_PEG))
    : Number(formatFixed(reward.amount, reward.token.exp)) *
      reward.token.usdPrice;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const calculateTaskRewardAsUSD = (
  reward: TaskReward | undefined
): number | undefined => {
  if (!reward?.token.usdPrice) return undefined;
  if (reward.peggedToUsd) {
    return Number(
      formatFixed(reward.amount, Constants.NUM_DECIMALS_IN_USD_PEG)
    );
  } else {
    const amount = Number(formatFixed(reward.amount, reward.token.exp));
    return amount * reward.token.usdPrice;
  }
};

export function useAddTaskToApolloCache(): (task: Task) => void {
  const apolloClient = useApolloClient();
  return useCallback(
    (task: Task) => {
      const hackyDurationForElasticsearchToIndexTask = 1000;
      setTimeout(() => {
        apolloClient.cache.evict({
          id: "ROOT_QUERY",
          fieldName: "getPaginatedTasks",
        });
      }, hackyDurationForElasticsearchToIndexTask);

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
            variables: { id: user.id },
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
  const updateTaskRoles = useUpdateTaskRoles();
  const setTaskGatingDefault = useSetTaskGatingDefault();
  return useCallback(
    async (
      { subtasks, reward, roleIds, defaultGating, ...values },
      projectId
    ) => {
      const task = await createTask({
        ...values,
        projectId,
        name: values.name?.trim(),
        dueDate: values.dueDate?.toISOString(),
        reward: !!reward ? toTaskReward(reward) : undefined,
      });
      if (values.status === TaskStatus.COMMUNITY_SUGGESTIONS) {
        await createTaskReaction({
          taskId: task.id,
          reaction: ":arrow_up_small:",
        });
      }

      if (!!roleIds) {
        await updateTaskRoles(task, roleIds);
      }

      if (defaultGating) {
        await setTaskGatingDefault({
          projectId,
          type: values.gating,
          roleIds: roleIds ?? [],
        });
      }

      for (const subtask of subtasks ?? []) {
        await createTask({
          parentTaskId: task.id,
          name: subtask.name?.trim(),
          description: subtask.description,
          ownerIds: !!user ? [user.id] : [],
          assigneeIds: subtask.assigneeIds,
          gating: TaskGatingType.ASSIGNEES,
          status: subtask.status,
          tagIds: [],
          projectId: task.projectId,
        });
      }

      return task;
    },
    [
      createTask,
      createTaskReaction,
      updateTaskRoles,
      setTaskGatingDefault,
      user,
    ]
  );
}
const getTaskOptimisticReponse = (
  task: Task | undefined,
  input: UpdateTaskInput
) => {
  if (!task) return undefined;
  return {
    // TODO: find a better way to merge optimistic task updates
    task: _.merge({}, task, _.omit(input, ["reward"])),
  };
};

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
        optimisticResponse: getTaskOptimisticReponse(task, input),
      });

      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.task;
    },
    [mutation]
  );
}

export function useUpdateTaskFromFormValues(
  task: Task | undefined
): (values: TaskFormValues) => Promise<void> {
  const updateTask = useUpdateTask();
  const updateTaskRoles = useUpdateTaskRoles();
  return useCallback(
    async ({ subtasks, roleIds, ...values }: TaskFormValues) => {
      const reward = !!values.reward
        ? toTaskReward(values.reward)
        : values.reward;
      if (!!reward || !_.isEmpty(values)) {
        const dueDate =
          values.dueDate === null ? null : values.dueDate?.toISOString();
        await updateTask(
          {
            id: task!.id,
            ...values,
            name: values.name?.trim(),
            reward,
            dueDate,
          },
          task!
        );
      }

      if (!!roleIds) {
        await updateTaskRoles(task!, roleIds);
      }
    },
    [updateTask, updateTaskRoles, task]
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
) => Promise<CreateTaskApplicationMutation["application"]> {
  const [mutation] = useMutation<
    CreateTaskApplicationMutation,
    CreateTaskApplicationMutationVariables
  >(Mutations.createTaskApplication);
  return useCallback(
    async (input) => {
      const res = await mutation({ variables: { input } });
      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.application;
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

export function useUpdateTaskTag(): (
  input: UpdateTaskTagInput
) => Promise<TaskTag> {
  const [createTaskTag] = useMutation<
    UpdateTaskTagMutation,
    UpdateTaskTagMutationVariables
  >(Mutations.updateTaskTag);
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
  existingTags: TaskTag[] | OrganizationTag[] | undefined
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
      (color) => !existingTags?.some((tag) => tag.color === color)
    );
    if (!!unusedColors.length) return unusedColors[0];
    return colors[Math.floor(Math.random() * colors.length)];
  }, [existingTags]);
}

export function useTask(
  taskId: string | undefined,
  fetchPolicy?: WatchQueryFetchPolicy
): {
  task: GetTaskQuery["task"] | undefined;
  error: ApolloError | undefined;
  refetch: () => Promise<unknown>;
} {
  const { data, error, refetch } = useQuery<
    GetTaskQuery,
    GetTaskQueryVariables
  >(Queries.task, {
    variables: { taskId: taskId! },
    skip: !taskId,
    fetchPolicy,
  });
  const task = data?.task ?? undefined;
  if (!task || task.id !== taskId) return { task: undefined, error, refetch };
  return { task, error, refetch };
}

export function useLazyTaskReactionUsers(taskId: string) {
  return useLazyQuery<
    GetTaskReactionUsersQuery,
    GetTaskReactionUsersQueryVariables
  >(Queries.taskReactionUsers, { variables: { taskId }, ssr: false });
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
  const { users } = useOrganizationUsers(project?.organizationId);
  return useMemo(() => {
    return _.uniqBy(
      [...(users ?? []), ...(additionalUsers ?? [])],
      (u) => u.id
    );
  }, [users, additionalUsers]);
}

export function useTaskRoles(
  task: Task | undefined
): RoleWithRules[] | undefined {
  const { project } = useProject(task?.projectId);
  const roles = useOrganizationRoles(project?.organizationId);
  return useMemo(
    () =>
      roles?.filter(
        (r) =>
          !!task && hasRule(r, RulePermission.MANAGE_TASKS, { taskId: task.id })
      ),
    [roles, task]
  );
}

export function useUpdateTaskRoles(): (
  task: Task,
  roleIds: string[]
) => Promise<void> {
  const apolloClient = useApolloClient();
  const createRule = useCreateRule();
  const deleteRule = useDeleteRule();
  return useCallback(
    async (task, roleIds) => {
      const taskId = task.id;
      const organizationId = await apolloClient
        .query<GetProjectQuery, GetProjectQueryVariables>({
          query: Queries.getProject,
          fetchPolicy: "cache-first",
          variables: { projectId: task.projectId },
        })
        .then((res) => res.data.project.organizationId);
      const roles = await apolloClient
        .query<GetOrganizationRolesQuery, GetOrganizationRolesQueryVariables>({
          query: Queries.organizationRoles,
          fetchPolicy: "cache-first",
          variables: { organizationId },
        })
        .then((res) => res.data.organization.roles);

      const permission = RulePermission.MANAGE_TASKS;
      const removedRoles = roles.filter(
        (r) => hasRule(r, permission, { taskId }) && !roleIds.includes(r.id)
      );
      const addedRoles = roles.filter(
        (r) => !hasRule(r, permission, { taskId }) && roleIds.includes(r.id)
      );

      for (const role of addedRoles) {
        await createRule({ permission, taskId, roleId: role.id });
      }

      for (const role of removedRoles) {
        const rule = getRule(role, permission, { taskId });
        await deleteRule(rule!.id);
      }
    },
    [createRule, deleteRule, apolloClient]
  );
}
