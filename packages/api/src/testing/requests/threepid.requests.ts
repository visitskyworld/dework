import { CreateMetamaskThreepidInput } from "@dewo/api/modules/threepid/dto/CreateMetamaskThreepidInput";
import { CreatePhantomThreepidInput } from "@dewo/api/modules/threepid/dto/CreatePhantomThreepidInput";
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
  public static createPhantomThreepid(
    input: CreatePhantomThreepidInput
  ): GraphQLTestClientRequestBody<{ input: CreatePhantomThreepidInput }> {
    return {
      query: `
        mutation CreatePhantomThreepid($input: CreatePhantomThreepidInput!) {
          threepid: createPhantomThreepid(input: $input) {
            id
            threepid
          }
        }
      `,
      variables: { input },
    };
  }
}
