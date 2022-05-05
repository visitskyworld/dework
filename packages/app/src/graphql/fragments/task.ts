import gql from "graphql-tag";

const taskViewFilter = gql`
  fragment TaskViewFilter on TaskViewFilter {
    type
    tagIds
    roleIds
    ownerIds
    assigneeIds
    statuses
    priorities
  }
`;

const taskViewFilterSortBy = gql`
  fragment TaskViewSortBy on TaskViewSortBy {
    field
    direction
  }
`;

export const taskView = gql`
  fragment TaskView on TaskView {
    id
    name
    slug
    type
    groupBy
    permalink
    projectId
    organizationId
    userId
    filters {
      ...TaskViewFilter
    }
    sortBys {
      ...TaskViewSortBy
    }
  }

  ${taskViewFilter}
  ${taskViewFilterSortBy}
`;
