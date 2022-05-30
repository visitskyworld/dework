import fs from "fs";
import path from "path";
import { delay } from "bluebird";
import * as request from "request-promise";
import _ from "lodash";
import { guilds } from "./guilds";

async function run() {
  const content = "dework";
  const auth = process.env.DISCORD_AUTH_TOKEN;
  const numPages = 1;

  for (const guild of guilds) {
    for (const page of _.range(numPages)) {
      console.log(`Searching guild ${guild.name} (${guild.id}) page ${page}`);

      const res = await request.get({
        url: `https://discord.com/api/v9/guilds/${guild.id}/messages/search`,
        qs: { content, offset: page * 25 },
        headers: { authorization: auth },
        json: true,
      });

      fs.writeFileSync(
        path.join("output", `${guild.id}-${page}.json`),
        JSON.stringify(res, null, 2)
      );
    }

    await delay(_.random(4000, 10000));
  }

  await delay(_.random(10000, 20000));
}

run();
