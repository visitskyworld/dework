import { INestApplication, Injectable } from "@nestjs/common";
import supertest, { Response } from "supertest";

export interface GraphQLTestClientRequestBody<Variables = unknown> {
  query: string;
  variables?: Variables;
}

@Injectable()
export class GraphQLTestClient {
  public async request<Variables = unknown>(params: {
    app: INestApplication;
    auth?: string;
    body: GraphQLTestClientRequestBody<Variables>;
  }): Promise<Response> {
    const response = await supertest(params.app.getHttpServer())
      .post("/graphql")
      .set("authorization", !!params.auth ? `Bearer ${params.auth}` : "")
      .send(params.body);

    return response;
  }

  expectGqlError(response: Response, status: number): void {
    const ext = response.body.errors?.[0].extensions;
    const actualStatus = ext?.exception?.status ?? ext?.response?.statusCode;
    expect(actualStatus).toEqual(status);
  }

  expectGqlErrorMessage(response: Response, message: string): void {
    const messages = response.body.errors[0].message;
    expect(messages).toContain(message);
  }
}
