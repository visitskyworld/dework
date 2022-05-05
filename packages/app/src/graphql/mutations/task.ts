import gql from "graphql-tag";
import { taskView } from "../fragments/task";

export const createTaskView = gql`
  mutation CreateTaskViewMutation($input: CreateTaskViewInput!) {
    taskView: createTaskView(input: $input) {
      ...TaskView
      project {
        id
        taskViews {
          ...TaskView
        }
      }
      user {
        id
        taskViews {
          ...TaskView
        }
      }
      organization {
        id
        taskViews {
          ...TaskView
        }
      }
    }
  }

  ${taskView}
`;

export const updateTaskView = gql`
  mutation UpdateTaskViewMutation($input: UpdateTaskViewInput!) {
    taskView: updateTaskView(input: $input) {
      ...TaskView
      project {
        id
        taskViews {
          ...TaskView
        }
      }
      user {
        id
        taskViews {
          ...TaskView
        }
      }
      organization {
        id
        taskViews {
          ...TaskView
        }
      }
    }
  }

  ${taskView}
`;
