import { Controller, Get, Logger, Param, Req, Res } from "@nestjs/common";
import * as request from "request-promise";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";
import { Server } from "http";
import { AddressInfo } from "net";
import { ConfigType } from "../../app/config";
import _ from "lodash";
import { HttpAdapterHost } from "@nestjs/core";
import { Coordinape } from "./coordinape.types";

interface CoordinapeIntegrationProjectTasksQuery {
  data: null | {
    project: {
      id: string;
      permalink: string;
      tasks: {
        id: string;
        name: string;
        permalink: string;
        assignees: {
          id: string;
          threepids: {
            source: "metamask" | unknown;
            address: string;
          }[];
        }[];
      }[];
    };
  };
  errors:
    | null
    | {
        message: string;
        extensions: {
          code: string;
          response: { statusCode: number; message: string; error: string };
        };
      }[];
}

@Controller("integrations/coordinape")
export class CoordinapeIntegrationController {
  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly config: ConfigService<ConfigType>
  ) {}

  @Get(":projectId")
  async githubCallback(
    @Req() req: Request,
    @Param("projectId") projectId: string,
    @Res() res: Response
  ) {
    const response: CoordinapeIntegrationProjectTasksQuery = await request.post(
      {
        url: this.serverGraphQLEndpoint(),
        json: true,
        headers: _.pick(req.headers, "authorization"),
        body: {
          query: `
              query CoordinapeIntegrationProjectTasksQuery($projectId: UUID!) {
                project: getProject(id: $projectId) {
                  id
                  permalink
                  tasks {
                    id
                    name
                    permalink
                    assignees {
                      id
                      threepids {
                        source
                        address: threepid
                      }
                    }
                  }
                }
              }
            `,
          variables: { projectId },
        },
      }
    );

    if (!response.data) {
      const error = response.errors![0];
      res
        .status(error.extensions.response.statusCode)
        .json({ error: error.message });
      return;
    }

    const users: Record<string, Coordinape.User> = {};
    for (const task of response.data.project.tasks) {
      for (const assignee of task.assignees) {
        const address = assignee.threepids.find(
          (threepid) => threepid.source === "metamask"
        )?.address;
        if (!address) continue;

        users[address] = users[address] ?? {
          address,
          contributions: [],
          contribution_details_link: `${response.data.project.permalink}?assigneeIds=${assignee.id}`,
        };
        users[address].contributions.push({
          title: task.name,
          link: task.permalink,
        });
      }
    }

    return res.json({ users: Object.values(users) });
  }

  private serverGraphQLEndpoint() {
    const server: Server = this.httpAdapterHost.httpAdapter.getHttpServer();
    const addr = server.address() as AddressInfo;
    return `http://127.0.0.1:${addr.port}/graphql`;
  }
}
