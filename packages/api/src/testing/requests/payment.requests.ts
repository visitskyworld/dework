import { CreatePaymentMethodInput } from "@dewo/api/modules/payment/dto/CreatePaymentMethodInput";
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
}
