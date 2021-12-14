import {
  useApolloClient,
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";
import { useAuthContext } from "@dewo/app/contexts/AuthContext";
import * as Mutations from "@dewo/app/graphql/mutations";
import * as Queries from "@dewo/app/graphql/queries";
import * as Subscriptions from "@dewo/app/graphql/subscriptions";
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
  TaskCreatedSubscription,
  TaskTag,
  TaskUpdatedSubscription,
  UpdateTaskInput,
  UpdateTaskMutation,
  UpdateTaskMutationVariables,
  UserTasksQuery,
  UserTasksQueryVariables,
  ClaimTaskMutation,
  ClaimTaskMutationVariables,
  UnclaimTaskMutation,
  UnclaimTaskMutationVariables,
  User,
} from "@dewo/app/graphql/types";
import _ from "lodash";
import { useCallback, useMemo } from "react";
import { useOrganization } from "../organization/hooks";
import { useProject } from "../project/hooks";

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
  input: UpdateTaskInput,
  task: Task
) => Promise<Task> {
  const [mutation] = useMutation<
    UpdateTaskMutation,
    UpdateTaskMutationVariables
  >(Mutations.updateTask);
  return useCallback(
    async (input, task) => {
      const res = await mutation({
        variables: { input },
        optimisticResponse: {
          task: { ...task, ...input } as Task,
        },
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
  const addTaskToApolloCache = useAddTaskToApolloCache();
  useSubscription<TaskCreatedSubscription>(Subscriptions.taskCreated, {
    onSubscriptionData(options) {
      const task = options.subscriptionData.data?.task;
      if (!!task) addTaskToApolloCache(task);
    },
  });
  useSubscription<TaskUpdatedSubscription>(Subscriptions.taskUpdated, {
    onSubscriptionData(options) {
      const task = options.subscriptionData.data?.task;
      if (!!task) addTaskToApolloCache(task);
    },
  });
}

export function useTaskFormOwnerOptions(
  projectId: string,
  currentOwner: User | undefined
): User[] | undefined {
  const project = useProject(projectId);
  const organization = useOrganization(project?.organizationId);
  return useMemo(() => {
    if (!organization) {
      return !!currentOwner ? [currentOwner] : undefined;
    }

    const orgUsers = organization.members.map((m) => m.user);
    if (!currentOwner) return orgUsers;
    return _.uniqBy([...orgUsers, currentOwner], (u) => u.id);
  }, [organization, currentOwner]);
}
