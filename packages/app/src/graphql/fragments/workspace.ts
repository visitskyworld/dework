import gql from "graphql-tag";
import { project } from "./project";
import { taskTag, taskView } from "./task";

export const workspace = gql`
  fragment Workspace on Workspace {
    id
    name
    slug
    sortKey
    permalink
    organizationId
  }
`;

export const workspaceDetails = gql`
  fragment WorkspaceDetails on Workspace {
    ...Workspace
    taskViews {
      ...TaskView
    }
    projects {
      ...Project
      taskTags {
        ...TaskTag
      }
    }
  }

  ${workspace}
  ${taskView}
  ${taskTag}
  ${project}
`;
