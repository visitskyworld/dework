import { useMutation, useQuery } from "@apollo/client";
import { CreateTaskTagInput } from "@dewo/api/modules/project/dto/CreateTaskTagInput";
import { UpdateTaskInput } from "@dewo/api/modules/task/dto/UpdateTaskInput";
import * as Mutations from "@dewo/app/graphql/mutations";
import * as Queries from "@dewo/app/graphql/queries";
import {
  CreateProjectInput,
  CreateProjectMutation,
  CreateProjectMutationVariables,
  CreateTaskInput,
  CreateTaskMutation,
  CreateTaskMutationVariables,
  CreateTaskTagMutation,
  CreateTaskTagMutationVariables,
  GetProjectQuery,
  GetProjectQueryVariables,
  Project,
  ProjectDetails,
  Task,
  TaskTag,
  UpdateTaskMutation,
  UpdateTaskMutationVariables,
} from "@dewo/app/graphql/types";
import { useCallback } from "react";

export function useCreateProject(): (
  input: CreateProjectInput
) => Promise<Project> {
  const [createProject] = useMutation<
    CreateProjectMutation,
    CreateProjectMutationVariables
  >(Mutations.createProject);
  return useCallback(
    async (input) => {
      const res = await createProject({
        variables: { input },
        // refetchQueries: [{ query: Queries.me }],
      });

      if (!res.data) throw new Error(JSON.stringify(res.errors));
      return res.data?.project;
    },
    [createProject]
  );
}

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
          task: { ...task, ...input },
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

export function useProject(projectId: string): ProjectDetails | undefined {
  const { data } = useQuery<GetProjectQuery, GetProjectQueryVariables>(
    Queries.project,
    { variables: { projectId } }
  );
  return data?.project ?? undefined;
}
