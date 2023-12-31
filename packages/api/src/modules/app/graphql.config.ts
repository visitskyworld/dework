import { GqlModuleOptions, GqlOptionsFactory } from "@nestjs/graphql";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ConfigType } from "./config";
import { Request } from "express";
import { User } from "@dewo/api/models/User";
import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { AnalyticsClient } from "./analytics/analytics.client";

export interface GQLContext {
  req: Request;
  origin: string;
  user?: User;
}

function getAuthToken(req: Request): string | undefined {
  const authorization = req.headers.authorization;
  const match = authorization?.match(/^Bearer (.*)$/);
  return match?.[1];
}

export function getIpAddress(req: Request): string {
  // https://stackoverflow.com/a/10849772
  const address =
    (req.headers["x-forwarded-for"] as string) ||
    req.socket.remoteAddress ||
    "";
  // https://serverfault.com/questions/846489/can-x-forwarded-for-contain-multiple-ips
  if (address.includes(",")) return address.split(",")[0];
  return address;
}

@Injectable()
export class GraphQLConfig implements GqlOptionsFactory {
  private logger = new Logger("GraphQL");

  constructor(
    private readonly analytics: AnalyticsClient,
    private readonly config: ConfigService<ConfigType>,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  createGqlOptions(): GqlModuleOptions {
    const that = this;
    return {
      autoSchemaFile: true,
      // https://github.com/nestjs/graphql/issues/295#issuecomment-511191060
      fieldResolverEnhancers: ["guards"],
      introspection: this.config.get<boolean>("GRAPHQL_PLAYGROUND"),
      playground: this.config.get<boolean>("GRAPHQL_PLAYGROUND"),
      plugins: [
        {
          async requestDidStart(requestContext) {
            const startedAt = Date.now();
            const metadata = {
              variables: requestContext.request.variables,
              userId: requestContext.context.user?.id,
            };
            const prefix = `${
              requestContext.request.operationName
            } (${JSON.stringify(metadata)})`;
            that.logger.log(`${prefix}: started`);

            const user = requestContext.context.user;
            that.analytics.client?.logEvent({
              event_type: `GraphQL request: ${requestContext.request.operationName}`,
              user_id: user?.id,
              user_properties: !!user ? { username: user.username } : undefined,
              ip: getIpAddress(requestContext.context.req),
              event_properties: {
                variables: requestContext.request.variables,
                origin: requestContext.context.req.headers["origin"],
                userAgent: requestContext.context.req.headers["user-agent"],
              },
            });

            return {
              async didEncounterErrors(requestContext) {
                that.logger.error(
                  `${prefix}: encountered errors ${JSON.stringify(
                    requestContext.errors
                  )}`
                );
                that.logger.error(requestContext.errors);
              },
              async willSendResponse(responseContext) {
                const duration = Date.now() - startedAt;
                const size =
                  JSON.stringify(responseContext.response).length * 2;
                that.logger.log(
                  `${prefix}: completed in ${duration} ms, returned ${size} bytes`
                );

                that.analytics.client?.logEvent({
                  event_type: `GraphQL response: ${requestContext.request.operationName}`,
                  user_id: requestContext.context.user?.id,
                  ip: getIpAddress(requestContext.context.req),
                  event_properties: {
                    size,
                    duration,
                    errors: responseContext.errors,
                  },
                });
              },
            };
          },
        },
      ],
      context: async ({ req }): Promise<GQLContext> => {
        const origin = req.headers.origin;
        const user = await (async () => {
          const authToken = getAuthToken(req);
          if (!authToken) return undefined;
          const parsed = await this.jwtService
            .verifyAsync(authToken)
            .catch(() => undefined);
          if (!parsed) return undefined;
          const user = await this.userRepo.findOne({ id: parsed.userId });
          return user;
        })();

        req.user = user;
        return { req, origin, user };
      },
      // subscriptions: {
      //   "subscriptions-transport-ws": true,
      // },
    };
  }
}
