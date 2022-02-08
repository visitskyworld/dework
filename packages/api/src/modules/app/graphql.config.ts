import { GqlModuleOptions, GqlOptionsFactory } from "@nestjs/graphql";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ConfigType } from "./config";
import { Request } from "express";
import { User } from "@dewo/api/models/User";
import { AuthorizableUser } from "nest-casl";
import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import * as Amplitude from "@amplitude/node";
import { Roles } from "./app.roles";

export interface GQLContext {
  req: Request;
  user?: User;
  caslUser?: AuthorizableUser<Roles, string | undefined>;
}

function getAuthToken(req: Request): string | undefined {
  const authorization = req.headers.authorization;
  const match = authorization?.match(/^Bearer (.*)$/);
  return match?.[1];
}

function getIpAddress(req: Request): string {
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
  private amplitude?: Amplitude.NodeClient;

  constructor(
    private readonly config: ConfigService<ConfigType>,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {
    const amplitudeApiKey = config.get("AMPLITUDE_API_KEY");
    if (!!amplitudeApiKey) {
      this.amplitude = Amplitude.init(amplitudeApiKey);
    } else {
      this.logger.warn(
        "Amplitude event logging not enabled! Set env var AMPLITUDE_API_KEY to enable."
      );
    }
  }

  createGqlOptions(): GqlModuleOptions {
    const superadminIds = this.config.get<string>("SUPERADMIN_USER_IDS") ?? "";
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
              caslUser: requestContext.context.caslUser,
            };
            const prefix = `${
              requestContext.request.operationName
            } (${JSON.stringify(metadata)})`;
            that.logger.log(`${prefix}: started`);

            const user = requestContext.context.user;
            that.amplitude?.logEvent({
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

                that.amplitude?.logEvent({
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
      context: async ({ req }): Promise<Promise<GQLContext>> => {
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

        let roles: Roles[] = [];
        if (!!user) roles.push(Roles.authenticated);
        if (!!user && superadminIds.includes(user.id)) {
          roles.push(Roles.superadmin);
        }
        const caslUser: AuthorizableUser<Roles, string | undefined> = {
          id: user?.id,
          roles,
        };

        req.user = user;
        req.caslUser = caslUser;
        return { req, user, caslUser };
      },
      // subscriptions: {
      //   "subscriptions-transport-ws": true,
      // },
    };
  }
}
