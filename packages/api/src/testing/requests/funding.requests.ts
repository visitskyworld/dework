import { CreateFundingSessionInput } from "@dewo/api/modules/funding/dto/CreateFundingSessionInput";
import { FundingVoteInput } from "@dewo/api/modules/funding/dto/FundingVoteInput";
import { GraphQLTestClientRequestBody } from "../GraphQLTestClient";

export class FundingRequests {
  public static createSession(
    input: CreateFundingSessionInput
  ): GraphQLTestClientRequestBody<{ input: CreateFundingSessionInput }> {
    return {
      query: `
        mutation CreateFundingSession($input: CreateFundingSessionInput!) {
          session: createFundingSession(input: $input) {
            id
            amount
            tokenId
            startDate
            endDate
            projects {
              id
            }
            organization {
              id
              fundingSessions {
                id
              }
            }
          }
        }
      `,
      variables: { input },
    };
  }

  public static vote(
    input: FundingVoteInput
  ): GraphQLTestClientRequestBody<{ input: FundingVoteInput }> {
    return {
      query: `
        mutation SetFundingVote($input: FundingVoteInput!) {
          vote: setFundingVote(input: $input) {
            id
            weight
            taskId
            userId
            session {
              id
              votes {
                id
              }
              voters {
                user {
                  id
                }
              }
            }
          }
        }
      `,
      variables: { input },
    };
  }

  public static close(
    id: string
  ): GraphQLTestClientRequestBody<{ id: string }> {
    return {
      query: `
        mutation CloseFundingSession($id: UUID!) {
          session: closeFundingSession(id: $id) {
            id
            closedAt
            rewards {
              amount
              tokenId
              task {
                id
                assignees {
                  id
                }
                parentTask {
                  id
                }
              }
            }
          }
        }
      `,
      variables: { id },
    };
  }
}
