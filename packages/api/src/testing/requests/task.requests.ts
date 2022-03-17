import { CreateTaskInput } from "@dewo/api/modules/task/dto/CreateTaskInput";
import { CreateTaskApplicationInput } from "@dewo/api/modules/task/dto/CreateTaskApplicationInput";
import { UpdateTaskInput } from "@dewo/api/modules/task/dto/UpdateTaskInput";
import { GraphQLTestClientRequestBody } from "../GraphQLTestClient";
import { GetTasksInput } from "@dewo/api/modules/task/dto/GetTasksInput";
import { TaskReactionInput } from "@dewo/api/modules/task/dto/TaskReactionInput";
import { DeleteTaskApplicationInput } from "@dewo/api/modules/task/dto/DeleteTaskApplicationInput";
import { CreateTaskSubmissionInput } from "@dewo/api/modules/task/dto/CreateTaskSubmissionInput";
import { UpdateTaskSubmissionInput } from "@dewo/api/modules/task/dto/UpdateTaskSubmissionInput";

export class TaskRequests {
  private static taskApplicationFragment = `
    fragment TaskApplication on TaskApplication {
      user {
        id
      }
      message
      startDate
      endDate
    }
  `;

  private static taskFragment = `
    fragment Task on Task {
      id
      number
      name
      description
      status
      doneAt
      deletedAt
      tags {
        id
      }
      project {
        id
        organization {
          id
          users {
            id
          }
        }
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
        ...TaskApplication
      }
      submissions {
        userId
        content
        deletedAt
      }
      reactions {
        reaction
        userId
      }
      parentTask {
        id
        subtasks {
          id
          name
        }
      }
    }

    ${TaskRequests.taskApplicationFragment}
  `;

  private static taskSubmissionFragment = `
    fragment TaskSubmission on TaskSubmission {
      id
      content
      deletedAt
      userId
      taskId
      task {
        ...Task
      }
    }

    ${TaskRequests.taskFragment}
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

  public static createApplication(
    input: CreateTaskApplicationInput
  ): GraphQLTestClientRequestBody<{ input: CreateTaskApplicationInput }> {
    return {
      query: `
      mutation CreateTaskApplication(
        $input: CreateTaskApplicationInput!
      ) {
        application: createTaskApplication(input: $input) {
          id
          task {
            ...Task
          }
        }
      }

        ${this.taskFragment}
      `,
      variables: { input },
    };
  }

  public static deleteApplication(
    input: DeleteTaskApplicationInput
  ): GraphQLTestClientRequestBody<{ input: DeleteTaskApplicationInput }> {
    return {
      query: `
        mutation DeleteTaskApplication($input: DeleteTaskApplicationInput!) {
          task: deleteTaskApplication(input: $input) {
            ...Task
          }
        }

        ${this.taskFragment}
      `,
      variables: { input },
    };
  }

  public static createSubmission(
    input: CreateTaskSubmissionInput
  ): GraphQLTestClientRequestBody<{ input: CreateTaskSubmissionInput }> {
    return {
      query: `
      mutation CreateTaskSubmission(
        $input: CreateTaskSubmissionInput!
      ) {
        submission: createTaskSubmission(input: $input) {
          ...TaskSubmission
          task {
            id
            submissions {
              ...TaskSubmission
            }
          }
        }
      }

      ${this.taskSubmissionFragment}
      `,
      variables: { input },
    };
  }

  public static updateSubmission(
    input: UpdateTaskSubmissionInput
  ): GraphQLTestClientRequestBody<{ input: UpdateTaskSubmissionInput }> {
    return {
      query: `
        mutation UpdateTaskSubmission($input: UpdateTaskSubmissionInput!) {
          submission: updateTaskSubmission(input: $input) {
            ...TaskSubmission
            task {
              id
              submissions {
                ...TaskSubmission
              }
            }
          }
        }

        ${this.taskSubmissionFragment}
      `,
      variables: { input },
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
