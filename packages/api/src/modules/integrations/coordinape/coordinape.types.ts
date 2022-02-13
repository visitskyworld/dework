export namespace Coordinape {
  export interface Contribution {
    title: string;
    link: string;
  }

  export interface User {
    address: string;
    contributions: Contribution[];
    contribution_details_link: string;
  }

  interface SuccessResponse {
    users: User[];
    error: undefined;
  }

  interface ErrorResponse {
    users: undefined;
    error: string;
  }

  export type Response = SuccessResponse | ErrorResponse;
}
