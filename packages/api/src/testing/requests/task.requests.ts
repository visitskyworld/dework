import { CreateTaskInput } from "@dewo/api/modules/task/dto/CreateTaskInput";
import { CreateTaskPaymentInput } from "@dewo/api/modules/task/dto/CreateTaskPaymentInput";
import { UpdateTaskInput } from "@dewo/api/modules/task/dto/UpdateTaskInput";
import { GraphQLTestClientRequestBody } from "../GraphQLTestClient";

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
        currency
        trigger
        payment {
          id
          txHash
          status
          fromId
          toId
          data
        }
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

  public static claim(
    taskId: string
  ): GraphQLTestClientRequestBody<{ taskId: string }> {
    return {
      query: `
        mutation ClaimTask($taskId: UUID!) {
          task: claimTask(id: $taskId) {
            ...Task
          }
        }

        ${this.taskFragment}
      `,
      variables: { taskId },
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

  public static createPayment(
    input: CreateTaskPaymentInput
  ): GraphQLTestClientRequestBody<{ input: CreateTaskPaymentInput }> {
    return {
      query: `
        mutation CreateTaskPayment($input: CreateTaskPaymentInput!) {
          task: createTaskPayment(input: $input) {
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
