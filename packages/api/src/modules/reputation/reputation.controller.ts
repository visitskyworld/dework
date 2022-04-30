import { Controller, Get, Param, Req, Res } from "@nestjs/common";
import * as request from "request-promise";
import { Response, Request } from "express";
import { Server } from "http";
import { AddressInfo } from "net";
import { HttpAdapterHost } from "@nestjs/core";
import { ethers } from "ethers";
import { ThreepidService } from "../threepid/threepid.service";
import { ThreepidSource } from "@dewo/api/models/Threepid";
import { AnalyticsClient } from "../app/analytics/analytics.client";
import { getIpAddress } from "../app/graphql.config";
import { Reputation } from "./reputation.types";

@Controller("v1/reputation")
export class ReputationController {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly threepidService: ThreepidService,
    private readonly analytics: AnalyticsClient
  ) {}

  @Get(":address")
  async getContributions(
    @Param("address") unformattedAddress: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      const address = ethers.utils.getAddress(unformattedAddress);
      const threepid = await this.threepidService.findOne({
        source: ThreepidSource.metamask,
        threepid: address,
      });

      this.analytics.client?.logEvent({
        ip: getIpAddress(req),
        event_type: "Requesting reputation",
        event_properties: {
          address,
          threepidId: threepid?.id,
          userId: threepid?.userId,
        },
      });

      if (!threepid?.userId) {
        res.json({ address, tasks: [] });
        return;
      }

      const response: any = await request.post({
        url: this.serverGraphQLEndpoint(),
        json: true,
        body: {
          query: `
            query UserReputationQuery($userId: UUID!) {
              user: getUser(id: $userId) {
                tasks(filter: { statuses: [DONE] }) {
                  name
                  permalink
                  points: storyPoints
                  date: doneAt
                  tags {
                    label
                  }
                  reward {
                    amount
                    token {
                      address
                      network {
                        slug
                      }
                    }
                  }
                  project {
                    name
                    permalink
                    organization {
                      name
                      permalink
                    }
                  }
                }
              }
            }
          `,
          variables: { userId: threepid.userId },
        },
      });

      if (!response.data) {
        const error = response.errors![0];
        res
          .status(error.extensions.response.statusCode)
          .json({ error: error.message });
        return;
      }

      const data: Reputation.Response = {
        address,
        tasks: response.data.user.tasks,
      };
      return res.json(data);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  private serverGraphQLEndpoint() {
    const server: Server = this.httpAdapterHost.httpAdapter.getHttpServer();
    const addr = server.address() as AddressInfo;
    return `http://127.0.0.1:${addr.port}/graphql`;
  }
}
