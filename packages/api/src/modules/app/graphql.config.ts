import { ApolloServerPlugin } from "apollo-server-plugin-base";
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
import { Roles } from "./app.roles";

export interface GQLContext {
  req: Request;
  user?: User;
  caslUser?: AuthorizableUser<Roles, string | undefined>;
}

const logger = new Logger("GraphQL");
const loggerPlugin: ApolloServerPlugin<GQLContext> = {
  async requestDidStart(requestContext) {
    const startedAt = Date.now();
    logger.log(
      `${requestContext.request.operationName} (${JSON.stringify(
        requestContext.request.variables
      )}): started`
    );
    return {
      async willSendResponse(responseContext) {
        const duration = Date.now() - startedAt;
        const size = JSON.stringify(responseContext.response).length * 2;
        logger.log(
          `${requestContext.request.operationName} (${JSON.stringify(
            requestContext.request.variables
          )}): completed in ${duration} ms, returned ${size} bytes`
        );
      },
    };
  },
};

function getAuthToken(req: Request): string | undefined {
  const authorization = req.headers.authorization;
  const match = authorization?.match(/^Bearer (.*)$/);
  return match?.[1];
}

@Injectable()
export class GraphQLConfig implements GqlOptionsFactory {
  constructor(
    private readonly config: ConfigService<ConfigType>,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  createGqlOptions(): GqlModuleOptions {
    const superadminIds = this.config.get<string>("SUPERADMIN_USER_IDS") ?? "";
    return {
      autoSchemaFile: true,
      // https://github.com/nestjs/graphql/issues/295#issuecomment-511191060
      fieldResolverEnhancers: ["guards"],
      introspection: this.config.get<boolean>("GRAPHQL_PLAYGROUND"),
      playground: this.config.get<boolean>("GRAPHQL_PLAYGROUND"),
      plugins: [loggerPlugin],
      formatError(error: Error) {
        logger.error(`Error: ${error.message}`);
        logger.error(error);
        return error;
      },
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
      subscriptions: {
        "subscriptions-transport-ws": true,
      },
    };
  }
}
