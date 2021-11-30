import { CreateTaskInput } from "@dewo/api/modules/task/dto/CreateTaskInput";
import { UpdateTaskInput } from "@dewo/api/modules/task/dto/UpdateTaskInput";
import { GraphQLTestClientRequestBody } from "../GraphQLTestClient";

export class TaskRequests {
  private static taskFragment = `
    fragment Task on Task {
      id
      name
      description
      status
      tags {
        id
      }
      project {
        id
      }
      assignees {
        id
      }
      reward {
        amount
        currency
        trigger
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
}
