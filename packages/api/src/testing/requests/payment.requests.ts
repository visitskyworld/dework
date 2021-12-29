import { CreatePaymentMethodInput } from "@dewo/api/modules/payment/dto/CreatePaymentMethodInput";
import { CreatePaymentTokenInput } from "@dewo/api/modules/payment/dto/CreatePaymentTokenInput";
import { GraphQLTestClientRequestBody } from "../GraphQLTestClient";

export class PaymentRequests {
  public static createPaymentMethod(
    input: CreatePaymentMethodInput
  ): GraphQLTestClientRequestBody<{ input: CreatePaymentMethodInput }> {
    return {
      query: `
        mutation CreatePaymentMethod($input: CreatePaymentMethodInput!) {
          paymentMethod: createPaymentMethod(input: $input) {
            id
            type
            address
            creatorId
          }
        }
      `,
      variables: { input },
    };
  }

  public static createPaymentToken(
    input: CreatePaymentTokenInput
  ): GraphQLTestClientRequestBody<{ input: CreatePaymentTokenInput }> {
    return {
      query: `
        mutation CreatePaymentToken($input: CreatePaymentTokenInput!) {
          token: createPaymentToken(input: $input) {
            id
            type
            address
            networkId
            name
            symbol
            exp
            visibility
          }
        }
      `,
      variables: { input },
    };
  }
}
