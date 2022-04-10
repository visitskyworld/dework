import { Request, Response } from "express";
import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import * as request from "request-promise";
import { getIpAddress } from "../graphql.config";

interface EventPayload {
  checksum: string;
  client: string;
  e: string;
  upload_time: string;
  v: "2";
}

@Controller("a")
export class AnalyticsController {
  @Post()
  async amplitudeEventProxy(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: EventPayload
  ) {
    await request.post({
      url: "https://api.amplitude.com",
      headers: { "x-forwarded-for": getIpAddress(req) },
      form: body,
    });
    res.status(200).send("success");
  }
}
