import { Injectable, OnModuleInit } from "@nestjs/common";
import { EventSubscriber } from "typeorm";
import * as Discord from "discord.js";
import { ConfigService } from "@nestjs/config";
import { ConfigType } from "../../app/config";

@Injectable()
@EventSubscriber()
export class DiscordService implements OnModuleInit {
  public client: Discord.Client;

  constructor(private readonly config: ConfigService<ConfigType>) {
    this.client = new Discord.Client({ intents: [] });
  }

  async onModuleInit() {
    await this.client.login(this.config.get("DISCORD_BOT_TOKEN"));
  }

  public async create(): Promise<Discord.Client> {
    return this.client;
    // const client = new Discord.Client({ intents: [] });
    // await this.client.login(this.config.get("DISCORD_BOT_TOKEN"));
    // return client;
  }
}
