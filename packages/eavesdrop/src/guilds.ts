import * as request from "request-promise";
import { delay } from "bluebird";
import _ from "lodash";

interface Guild {
  name: string;
  id: string;
}

// const guilds: Guild[] = [
//   // { name: "Dework", id: "918603668935311391" },
//   { name: "New Order", id: "910352056634720266" }, // https://discord.com/invite/neworderdao
//   { name: "Aragon", id: "672466989217873929" }, // https://discord.com/invite/aragon
//   { name: "White Hat DAO", id: "910352056634720266" }, // https://discord.gg/sHbRMxev3p
//   { name: "Yu DAO", id: "975583729080741888" }, // https://discord.gg/YuDAO
//   { name: "People DAO", id: "912907132502937710" }, // https://discord.gg/peopledao
//   { name: "Redacted Cartel", id: "894336811185348658" }, // https://discord.gg/RwghRM6Shf
//   { name: "DAO Square", id: "678414857510453309" }, // https://discord.com/invite/JngTE8xMgX
//   { name: "Gitcoin", id: "562828676480237578" }, // https://discord.com/invite/gitcoin
//   { name: "KrauseHouse", id: "847908414981275648" }, // https://discord.gg/3bJwMCUEbe
//   { name: "CityDAO", id: "860356969521217536" }, // https://discord.com/invite/2pzV6wnWZx
//   { name: "Bend DAO", id: "897709643948761148" }, // http://discord.gg/BendDAO
//   { name: "Raid Guild", id: "684227450204323876" }, // https://discord.gg/rGFpfQf
// ];

export async function loadGuilds(): Promise<Guild[]> {
  const auth = process.env.DISCORD_AUTH_TOKEN;

  const guilds: Guild[] = [];
  while (true) {
    const lastId = guilds[guilds.length - 1]?.id;
    console.log("Getting guilds", { current: guilds.length, lastId });

    const res = await request.get({
      url: "https://discord.com/api/v9/users/@me/guilds",
      qs: { after: lastId },
      headers: { authorization: auth },
      json: true,
    });

    const newGuilds = res.map((g: any) => ({ id: g.id, name: g.name }));
    guilds.push(...newGuilds);

    console.log(newGuilds);

    if (res.length < 20) break;

    await delay(_.random(1000, 2000));
  }

  return guilds;
}
