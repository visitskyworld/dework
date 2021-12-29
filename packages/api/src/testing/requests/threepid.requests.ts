import { CreateMetamaskThreepidInput } from "@dewo/api/modules/threepid/dto/CreateMetamaskThreepidInput";
import { GraphQLTestClientRequestBody } from "../GraphQLTestClient";

export class ThreepidRequests {
  public static createMetamaskThreepid(
    input: CreateMetamaskThreepidInput
  ): GraphQLTestClientRequestBody<{ input: CreateMetamaskThreepidInput }> {
    return {
      query: `
        mutation CreateMetamaskThreepid($input: CreateMetamaskThreepidInput!) {
          threepid: createMetamaskThreepid(input: $input) {
            id
            threepid
          }
        }
      `,
      variables: { input },
    };
  }
}
