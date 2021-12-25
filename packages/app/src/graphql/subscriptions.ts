import gql from "graphql-tag";
import * as Fragments from "./fragments";

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

  ${Fragments.payment}
`;
