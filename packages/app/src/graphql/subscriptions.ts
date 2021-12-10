import gql from "graphql-tag";
import * as Fragments from "./fragments";

export const taskCreated = gql`
  subscription TaskCreatedSubscription {
    task: onTaskCreated {
      ...Task
    }
  }

  ${Fragments.task}
`;

export const taskUpdated = gql`
  subscription TaskUpdatedSubscription {
    task: onTaskUpdated {
      ...Task
    }
  }

  ${Fragments.task}
`;
