import { Request, Response } from "express";
import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { AnalyticsClient } from "./analytics.client";
import { Event } from "@amplitude/node";
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
  constructor(private readonly analytics: AnalyticsClient) {}

  @Post()
  async amplitudeEventProxy(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: EventPayload
  ) {
    const ip = getIpAddress(req);
    const events: Event[] = JSON.parse(body.e);
    events.forEach((e) => this.analytics.client?.logEvent({ ...e, ip }));
    res.status(200).send("success");
  }
}
