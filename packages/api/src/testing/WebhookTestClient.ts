import { INestApplication, Injectable } from "@nestjs/common";
import supertest, { Response } from "supertest";

export interface WebhookTestClientRequestBody<Variables = unknown> {
  query: string;
  variables?: Variables;
}

@Injectable()
export class WebhookTestClient {
  public async request<Variables = unknown>(params: {
    app: INestApplication;
    auth?: string;
    body: WebhookTestClientRequestBody<Variables>;
  }): Promise<Response> {
    const response = await supertest(params.app.getHttpServer())
      .post("/github/webhook")
      .set("authorization", !!params.auth ? `Bearer ${params.auth}` : "")
      .send(params.body);

    return response;
  }
}
