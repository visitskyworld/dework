import gql from "graphql-tag";
import * as Fragments from "./fragments";
import { payment } from "./fragments/payment";

export const taskCreated = gql`
  subscription TaskCreatedSubscription {
    task: onTaskCreated {
      ...TaskDetails
    }
  }

  ${Fragments.taskDetails}
`;

export const taskUpdated = gql`
  subscription TaskUpdatedSubscription {
    task: onTaskUpdated {
      ...TaskDetails
    }
  }

  ${Fragments.taskDetails}
`;

export const paymentUpdated = gql`
  subscription PaymentUpdatedSubscription {
    payment: onPaymentUpdated {
      ...Payment
    }
  }

  ${payment}
`;

export const taskRewardUpdated = gql`
  subscription TaskRewardUpdatedSubscription {
    taskReward: onTaskRewardUpdated {
      ...TaskReward
    }
  }

  ${Fragments.taskReward}
`;
