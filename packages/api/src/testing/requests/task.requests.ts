import { CreateTaskInput } from "@dewo/api/modules/task/dto/CreateTaskInput";
import { CreateTaskApplicationInput } from "@dewo/api/modules/task/dto/CreateTaskApplicationInput";
import { UpdateTaskInput } from "@dewo/api/modules/task/dto/UpdateTaskInput";
import { GraphQLTestClientRequestBody } from "../GraphQLTestClient";
import { GetTasksInput } from "@dewo/api/modules/task/dto/GetTasksInput";
import { TaskReactionInput } from "@dewo/api/modules/task/dto/TaskReactionInput";

export class TaskRequests {
  private static taskFragment = `
    fragment Task on Task {
      id
      number
      name
      description
      status
      deletedAt
      tags {
        id
      }
      project {
        id
      }
      assignees {
        id
      }
      creator {
        id
      }
      owner {
        id
      }
      discordChannel {
        id
        channelId
        guildId
      }
      reward {
        id
        amount
        token {
          id
          name
          type
        }
        trigger
        payment {
          id
          status
          paymentMethodId
          data
        }
      }
      applications {
        user {
          id
        }
        message
        startDate
        endDate
      }
      reactions {
        reaction
        userId
      }
    }
  `;

  public static create(
    input: CreateTaskInput
  ): GraphQLTestClientRequestBody<{ input: CreateTaskInput }> {
    return {
      query: `
        mutation CreateTask($input: CreateTaskInput!) {
          task: createTask(input: $input) {
            ...Task
          }
        }

        ${this.taskFragment}
      `,
      variables: { input },
    };
  }

  public static update(
    input: UpdateTaskInput
  ): GraphQLTestClientRequestBody<{ input: UpdateTaskInput }> {
    return {
      query: `
        mutation UpdateTask($input: UpdateTaskInput!) {
          task: updateTask(input: $input) {
            ...Task
          }
        }

        ${this.taskFragment}
      `,
      variables: { input },
    };
  }

  public static get(
    taskId: string
  ): GraphQLTestClientRequestBody<{ taskId: string }> {
    return {
      query: `
        query GetTask($taskId: UUID!) {
          task: getTask(id: $taskId) {
            ...Task
          }
        }

        ${this.taskFragment}
      `,
      variables: { taskId },
    };
  }

  public static getBatch(
    input: GetTasksInput
  ): GraphQLTestClientRequestBody<{ input: GetTasksInput }> {
    return {
      query: `
        query GetTasks($input: GetTasksInput!) {
          tasks: getTasks(input: $input) {
            ...Task
          }
        }

        ${this.taskFragment}
      `,
      variables: { input },
    };
  }

  public static claim(
    taskId: string,
    application: CreateTaskApplicationInput
  ): GraphQLTestClientRequestBody<{
    taskId: string;
    application: CreateTaskApplicationInput;
  }> {
    return {
      query: `
      mutation ClaimTaskMutation(
        $taskId: UUID!
        $application: CreateTaskApplicationInput!
      ) {
        task: claimTask(id: $taskId, application: $application) {
          ...Task
        }
      }

        ${this.taskFragment}
      `,
      variables: { taskId, application },
    };
  }

  public static unclaim(
    taskId: string
  ): GraphQLTestClientRequestBody<{ taskId: string }> {
    return {
      query: `
        mutation UnclaimTask($taskId: UUID!) {
          task: unclaimTask(id: $taskId) {
            ...Task
          }
        }

        ${this.taskFragment}
      `,
      variables: { taskId },
    };
  }

  public static createReaction(
    input: TaskReactionInput
  ): GraphQLTestClientRequestBody<{ input: TaskReactionInput }> {
    return {
      query: `
        mutation CreateTaskReaction($input: TaskReactionInput!) {
          task: createTaskReaction(input: $input) {
            ...Task
          }
        }

        ${this.taskFragment}
      `,
      variables: { input },
    };
  }

  public static deleteReaction(
    input: TaskReactionInput
  ): GraphQLTestClientRequestBody<{ input: TaskReactionInput }> {
    return {
      query: `
        mutation DeleteTaskReaction($input: TaskReactionInput!) {
          task: deleteTaskReaction(input: $input) {
            ...Task
          }
        }

        ${this.taskFragment}
      `,
      variables: { input },
    };
  }

  public static delete(
    taskId: string
  ): GraphQLTestClientRequestBody<{ taskId: string }> {
    return {
      query: `
        mutation DeleteTask($taskId: UUID!) {
          task: deleteTask(id: $taskId) {
            ...Task
          }
        }

        ${this.taskFragment}
      `,
      variables: { taskId },
    };
  }
}
