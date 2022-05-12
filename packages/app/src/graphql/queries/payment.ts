import gql from "graphql-tag";
import { paymentMethod } from "../fragments/payment";

export const projectPaymentMethods = gql`
  query GetProjectPaymentMethodsQuery($projectId: UUID!) {
    project: getProject(id: $projectId) {
      id
      paymentMethods {
        ...PaymentMethod
      }
    }
  }

  ${paymentMethod}
`;

export const organizationPaymentMethods = gql`
  query GetOrganizationPaymentMethodsQuery($organizationId: UUID!) {
    organization: getOrganization(id: $organizationId) {
      id
      projects {
        id
        paymentMethods {
          ...PaymentMethod
        }
      }
    }
  }

  ${paymentMethod}
`;
