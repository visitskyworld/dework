import gql from "graphql-tag";
import { workspaceDetails } from "../fragments/workspace";

export const getWorkspaceDetails = gql`
  query GetWorkspaceDetailsQuery($slug: String!) {
    workspace: getWorkspaceBySlug(slug: $slug) {
      ...WorkspaceDetails
    }
  }

  ${workspaceDetails}
`;
