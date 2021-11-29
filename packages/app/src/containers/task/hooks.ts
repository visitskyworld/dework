import { useMutation, useQuery } from "@apollo/client";
import * as Mutations from "@dewo/app/graphql/mutations";
import * as Queries from "@dewo/app/graphql/queries";
import {
  CreateTaskInput,
  CreateTaskMutation,
  CreateTaskMutationVariables,
  CreateTaskTagInput,
  CreateTaskTagMutation,
  CreateTaskTagMutationVariables,
  GetTaskQuery,
  GetTaskQueryVariables,
  Task,
  TaskTag,
  UpdateTaskInput,
  UpdateTaskMutation,
  UpdateTaskMutationVariables,
} from "@dewo/app/graphql/types";
import { useCallback } from "react";

export function useCreateTask(): (input: CreateTaskInput) => Promise<Task> {
  const [createTask] = useMutation<
    CreateTaskMutation,
    CreateTaskMutationVariables
  >(Mutations.createTask);
  return useCallback(
    async (input) => {
      const res = await createTask({
        variables: { input },
        // Temporary solution instead of updating Apollo cache directly
        refetchQueries: [
          { query: Queries.project, variables: { projectId: input.projectId } },
        ],
      });

      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.task;
    },
    [createTask]
  );
}

export function useUpdateTask(): (
  input: UpdateTaskInput,
  task: Task
) => Promise<Task> {
  const [updateTask] = useMutation<
    UpdateTaskMutation,
    UpdateTaskMutationVariables
  >(Mutations.updateTask);
  return useCallback(
    async (input, task) => {
      const res = await updateTask({
        variables: { input },
        optimisticResponse: {
          task: { ...task, ...input } as Task,
        },
      });

      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.task;
    },
    [updateTask]
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

export function useTask(taskId: string | undefined): Task | undefined {
  const { data } = useQuery<GetTaskQuery, GetTaskQueryVariables>(Queries.task, {
    variables: { taskId: taskId! },
    skip: !taskId,
  });
  return data?.task ?? undefined;
}
