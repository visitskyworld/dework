import * as Joi from "joi";

export interface ConfigType {
  PORT: number;
  GRAPHQL_PLAYGROUND: boolean;
  JWT_SECRET: string;
  APP_URL: string;
  API_URL: string;

  POSTGRES_URL: string;
  RUN_MIGRATIONS: boolean;

  REDIS_URL: string;

  GITHUB_OAUTH_CLIENT_ID: string;
  GITHUB_OAUTH_CLIENT_SECRET: string;
  GITHUB_APP_ID: string;
  GITHUB_APP_CLIENT_ID: string;
  GITHUB_APP_CLIENT_SECRET: string;
  GITHUB_APP_PRIVATE_KEY: string;

  DISCORD_OAUTH_CLIENT_ID: string;
  DISCORD_OAUTH_CLIENT_SECRET: string;
  DISCORD_BOT_TOKEN: string;
  DISCORD_DEWORK_GUILD_ID: string;
  DISCORD_DEWORK_FEEDBACK_CHANNEL_ID: string;

  NOTION_OAUTH_CLIENT_ID: string;
  NOTION_OAUTH_CLIENT_SECRET: string;

  TRELLO_API_KEY: string;

  GOOGLE_CLOUD_CREDENTIALS: string;
  GOOGLE_CLOUD_STORAGE_BUCKET_NAME: string;

  SUPERADMIN_USER_IDS: string;
}

const MAX_PORT = 65535;
export const configSchema = Joi.object<ConfigType>({
  PORT: Joi.number().min(0).max(MAX_PORT),
  GRAPHQL_PLAYGROUND: Joi.boolean(),
  JWT_SECRET: Joi.string().required(),
  APP_URL: Joi.string().required(),
  API_URL: Joi.string().required(),

  POSTGRES_URL: Joi.string().required(),
  RUN_MIGRATIONS: Joi.boolean().default(false),

  REDIS_URL: Joi.string().required(),

  GITHUB_OAUTH_CLIENT_ID: Joi.string().required(),
  GITHUB_OAUTH_CLIENT_SECRET: Joi.string().required(),
  GITHUB_APP_ID: Joi.number().required(),
  GITHUB_APP_CLIENT_ID: Joi.string().required(),
  GITHUB_APP_CLIENT_SECRET: Joi.string().required(),
  GITHUB_APP_PRIVATE_KEY: Joi.string().required(),

  DISCORD_OAUTH_CLIENT_ID: Joi.string().required(),
  DISCORD_OAUTH_CLIENT_SECRET: Joi.string().required(),
  DISCORD_BOT_TOKEN: Joi.string().required(),
  DISCORD_DEWORK_GUILD_ID: Joi.string().required(),
  DISCORD_DEWORK_FEEDBACK_CHANNEL_ID: Joi.string().required(),

  NOTION_OAUTH_CLIENT_ID: Joi.string().required(),
  NOTION_OAUTH_CLIENT_SECRET: Joi.string().required(),

  TRELLO_API_KEY: Joi.string().required(),

  GOOGLE_CLOUD_CREDENTIALS: Joi.string().required(),
  GOOGLE_CLOUD_STORAGE_BUCKET_NAME: Joi.string().required(),

  SUPERADMIN_USER_IDS: Joi.string().allow(""),
});
