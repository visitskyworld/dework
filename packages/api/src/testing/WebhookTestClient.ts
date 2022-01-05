import { INestApplication, Injectable } from "@nestjs/common";
import supertest, { Response } from "supertest";

@Injectable()
export class WebhookTestClient {
  public async request<BodyType extends object>(params: {
    app: INestApplication;
    auth?: string;
    body: BodyType;
  }): Promise<Response> {
    const response = await supertest(params.app.getHttpServer())
      .post("/github/webhook")
      .set("authorization", !!params.auth ? `Bearer ${params.auth}` : "")
      .send(params.body);

    return response;
  }
}
