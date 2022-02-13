import { Controller, Get, Param, Query, Req, Res } from "@nestjs/common";
import * as request from "request-promise";
import { Request, Response } from "express";
import { Server } from "http";
import { AddressInfo } from "net";
import _ from "lodash";
import { HttpAdapterHost } from "@nestjs/core";
import { Coordinape } from "./coordinape.types";
import { TaskFilterInput } from "../../task/dto/GetTasksInput";
import { TaskStatus } from "@dewo/api/models/Task";

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
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  @Get(":projectId")
  async githubCallback(
    @Req() req: Request,
    @Param("projectId") projectId: string,
    @Query("epoch_start") doneAtAfter: number,
    @Query("epoch_end") doneAtBefore: number,
    @Res() res: Response
  ) {
    const filter: TaskFilterInput = {
      statuses: [TaskStatus.DONE],
      doneAtAfter: new Date(doneAtAfter * 1000),
      doneAtBefore: new Date(doneAtBefore * 1000),
    };
    const response: CoordinapeIntegrationProjectTasksQuery = await request.post(
      {
        url: this.serverGraphQLEndpoint(),
        json: true,
        headers: _.pick(req.headers, "authorization"),
        body: {
          query: `
              query CoordinapeIntegrationProjectTasksQuery(
                $projectId: UUID!
                $filter: TaskFilterInput!
              ) {
                project: getProject(id: $projectId) {
                  id
                  permalink
                  tasks(filter: $filter) {
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
          variables: { projectId, filter },
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
          contribution_details_link: `${response.data.project.permalink}?assigneeIds=${assignee.id}&doneAtBefore=${doneAtBefore}&doneAtAfter=${doneAtAfter}`,
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
