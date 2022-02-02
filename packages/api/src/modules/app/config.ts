import * as Joi from "joi";

export interface ConfigType {
  PORT: number;
  GRAPHQL_PLAYGROUND: boolean;
  JWT_SECRET: string;
  APP_URL: string;
  API_URL: string;

  POSTGRES_URL: string;

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
  // TRELLO_API_SECRET: string;

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
  // TRELLO_API_SECRET: Joi.string().required(),

  GOOGLE_CLOUD_CREDENTIALS: Joi.string().required(),
  GOOGLE_CLOUD_STORAGE_BUCKET_NAME: Joi.string().required(),

  SUPERADMIN_USER_IDS: Joi.string().allow(""),
});

export const gifs = [
  "https://media.giphy.com/media/bMJqfOtgVEyI2PLnaW/giphy.gif",
  "https://media.giphy.com/media/rmi45iyhIPuRG/giphy.gif",
  "https://media.giphy.com/media/DYH297XiCS2Ck/giphy.gif",
  "https://media.giphy.com/media/cRe9VhznkdS4ACbDwF/giphy.gif",
  "https://media.giphy.com/media/gEkOjfxIuFy9lryrT3/giphy.gif",
  "https://media.giphy.com/media/S9i8jJxTvAKVHVMvvW/giphy.gif",
  "https://media.giphy.com/media/azICCwJD3pi1pqimJg/giphy.gif",
  "https://media.giphy.com/media/aZXRIHxo9saPe/giphy.gif",
  "https://media.giphy.com/media/YRuFixSNWFVcXaxpmX/giphy.gif",
  "https://media.giphy.com/media/l2Sq29cFXoF80ADlK/giphy.gif",
  "https://media.giphy.com/media/UGM8GHOE7lD0LPkvQ4/giphy.gif",
];
