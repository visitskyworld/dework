import * as fs from "fs";
import { guilds } from "./guilds";
import { parse } from "json2csv";
import _ from "lodash";

async function run() {
  const messages: {
    guild: string;
    date: string;
    sender: string;
    content: string;
    url: string;
  }[] = [];

  const files = fs.readdirSync("output");
  for (const file of files) {
    if (!file.endsWith(".json")) continue;

    const guildId = file.split("-")[0];
    const guild = guilds.find((g) => g.id === guildId)!;
    console.log(guildId, guild);

    const json = JSON.parse(fs.readFileSync(`output/${file}`).toString());
    for (const [message] of json.messages) {
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
    "output/messages.csv",
    parse(_.sortBy(messages, (m) => m.date).reverse(), {
      fields: Object.keys(messages[0]),
    })
  );
}

run();
