import * as fs from "fs";
import * as path from "path";
import { loadGuilds } from "./guilds";
import { parse } from "json2csv";
import _ from "lodash";

async function run() {
  const guilds = await loadGuilds();
  const messages: {
    guild: string;
    date: string;
    sender: string;
    content: string;
    url: string;
  }[] = [];

  const content = "bounty";

  const files = fs.readdirSync(path.join("output", content));
  for (const file of files) {
    if (!file.endsWith(".json")) continue;

    const guildId = file.split("-")[0];
    const guild = guilds.find((g) => g.id === guildId)!;
    console.log(guildId, guild);

    const json = JSON.parse(
      fs.readFileSync(path.join("output", content, file)).toString()
    );
    for (const [message] of json.messages ?? []) {
      messages.push({
        guild: guild.name,
        date: message.timestamp,
        sender: message.author.username,
        content: message.content,
        url: `https://discord.com/channels/${guild.id}/${message.channel_id}/${message.id}`,
      });
    }
  }

  fs.writeFileSync(
    path.join("output", content, "messages.csv"),
    parse(_.sortBy(messages, (m) => m.date).reverse(), {
      fields: Object.keys(messages[0]),
    })
  );
}

run();
