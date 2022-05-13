import gql from "graphql-tag";
import * as Fragments from "../fragments";

export const deleteOrganizationIntegration = gql`
  mutation DeleteOrganizationIntegrationMutation(
    $input: DeleteOrganizationIntegrationInput!
  ) {
    deleteOrganizationIntegration(input: $input) {
      ...OrganizationWithIntegrations
    }
  }

  ${Fragments.organizationWithIntegrations}
`;
