import { ApolloServerPlugin } from "apollo-server-plugin-base";
import { GqlModuleOptions } from "@nestjs/graphql";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ConfigType } from "./config";
import { Request } from "express";
import { User } from "@dewo/api/models/User";

export interface GQLContext {
  req: Request;
  user?: User;
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

export function gqlConfig(config: ConfigService<ConfigType>): GqlModuleOptions {
  return {
    autoSchemaFile: true,
    // https://github.com/nestjs/graphql/issues/295#issuecomment-511191060
    fieldResolverEnhancers: ["guards"],
    introspection: config.get<boolean>("GRAPHQL_PLAYGROUND"),
    playground: config.get<boolean>("GRAPHQL_PLAYGROUND"),
    plugins: [loggerPlugin],
    formatError(error: Error) {
      logger.error(`Error: ${error.message}`);
      logger.error(error);
      return error;
    },
    context: ({ req }): GQLContext => ({ req }),
  };
}
