import * as Joi from "joi";

export interface ConfigType {
  PORT: number;
  GRAPHQL_PLAYGROUND: boolean;
  JWT_SECRET: string;
  APP_URL: string;

  POSTGRES_URL: string;

  GITHUB_OAUTH_CLIENT_ID: string;
  GITHUB_OAUTH_CLIENT_SECRET: string;
  GITHUB_OAUTH_REDIRECT_URI: string;

  DISCORD_OAUTH_CLIENT_ID: string;
  DISCORD_OAUTH_CLIENT_SECRET: string;
  DISCORD_OAUTH_REDIRECT_URI: string;
}

const MAX_PORT = 65535;
export const configSchema = Joi.object<ConfigType>({
  PORT: Joi.number().min(0).max(MAX_PORT),
  GRAPHQL_PLAYGROUND: Joi.boolean(),
  JWT_SECRET: Joi.string().required(),
  APP_URL: Joi.string().required(),

  POSTGRES_URL: Joi.string().required(),

  GITHUB_OAUTH_CLIENT_ID: Joi.string().required(),
  GITHUB_OAUTH_CLIENT_SECRET: Joi.string().required(),
  GITHUB_OAUTH_REDIRECT_URI: Joi.string().required(),

  DISCORD_OAUTH_CLIENT_ID: Joi.string().required(),
  DISCORD_OAUTH_CLIENT_SECRET: Joi.string().required(),
  DISCORD_OAUTH_REDIRECT_URI: Joi.string().required(),
});
