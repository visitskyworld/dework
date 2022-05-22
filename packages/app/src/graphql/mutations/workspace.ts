import gql from "graphql-tag";
import { workspace } from "../fragments/workspace";

export const createWorkspace = gql`
  mutation CreateWorkspaceMutation($input: CreateWorkspaceInput!) {
    workspace: createWorkspace(input: $input) {
      ...Workspace
      organization {
        id
        workspaces {
          ...Workspace
        }
      }
    }
  }

  ${workspace}
`;

export const updateWorkspace = gql`
  mutation UpdateWorkspaceMutation($input: UpdateWorkspaceInput!) {
    workspace: updateWorkspace(input: $input) {
      ...Workspace
      organization {
        id
        workspaces {
          ...Workspace
        }
      }
    }
  }

  ${workspace}
`;
