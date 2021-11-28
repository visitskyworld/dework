import { CreateTaskInput } from "@dewo/api/modules/task/dto/CreateTaskInput";
import { GraphQLTestClientRequestBody } from "../GraphQLTestClient";

export class TaskRequests {
  public static create(
    input: CreateTaskInput
  ): GraphQLTestClientRequestBody<{ input: CreateTaskInput }> {
    return {
      query: `
        mutation CreateTask($input: CreateTaskInput!) {
          task: createTask(input: $input) {
            id
            name
            project {
              id
            }
          }
        }
      `,
      variables: { input },
    };
  }
}
