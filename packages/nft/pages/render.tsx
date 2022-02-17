import React from "react";
import moment from 'moment';
import { NFT } from "../src/components/NFT";

const Page = () => (
  <div style={{ display: "grid", placeItems: "center" }}>
    <NFT
      width={300}
      height={450}
      data={{
        organization: {
          name: "NIL",
          imageUrl:
            "https://storage.googleapis.com/assets.dework.xyz/uploads/a314d250-1fc6-4a1d-b20a-1040cea4c812/_AoPtxGt_400x400.jpeg",
        },
        task: {
          name: "Create an onboarding template",
          doneAt: moment("2022-02-17").toISOString(),
          permalink: "dework.xyz/XkMy3",
        },
        user: {
          username: "michaelshimeles",
          address: "0x944C9EF3Ca71E710388733E6C57974e8923A9020",
          imageUrl:
            "https://storage.googleapis.com/assets.dework.xyz/uploads/33a161c9-9cef-468c-9dbb-18b163037b2b/blueygo.png",
        },
        reviewer: {
          username: "TRHX",
          address: "0x34D7bCeaA2B3cfb1dE368BAA703683EDC666d3f1",
          imageUrl: "https://cdn.discordapp.com/avatars/763508165521702952/8ad71a514141ae4a212e1d3fb11f76c6.jpg",
        },
      }}
    />
  </div>
);

/*
const Page = () => (
  <div style={{ display: "grid", placeItems: "center" }}>
    <NFT
      width={300}
      height={450}
      data={{
        organization: {
          name: "LexDAO",
          imageUrl:
            "https://storage.googleapis.com/assets.dework.xyz/uploads/0960c2c5-f6b7-497b-a5cf-2391d9c45aec/logo.png",
        },
        task: {
          name: "Integrate PDF Generator",
          doneAt: moment("2022-01-25").toISOString(),
          permalink: "dework.xyz/XkMy3",
        },
        user: {
          username: "audsssy",
          address: "0x4744cda32bE7b3e75b9334001da9ED21789d4c0d",
          imageUrl:
            "https://storage.googleapis.com/assets.dework.xyz/uploads/0261f0ed-7a17-4021-8ec1-b17a94c53c55/one-piece-kozuki-oden-followers-reaction-wano-act-3-flashback-an-1256022.jpeg",
        },
        reviewer: {
          username: "ross",
          address: "0x1C0Aa8cCD568d90d61659F060D1bFb1e6f855A20",
          imageUrl: "https://storage.googleapis.com/assets.dework.xyz/uploads/22891fb9-4358-4c40-8c48-6a228770924a/MamfzGU_400x400.jpg",
        },
      }}
    />
  </div>
);
*/

/*
const Page = () => (
  <div style={{ display: "grid", placeItems: "center" }}>
    <NFT
      width={300}
      height={450}
      data={{
        organization: {
          name: "POAPathon",
          imageUrl:
            "https://cdn.discordapp.com/attachments/918879036694994965/943945709449781298/poapathon-2021-logo.png",
        },
        task: {
          name: "Setup multi-chain Gnosis safes",
          doneAt: moment("2022-02-14").toISOString(),
          permalink: "dework.xyz/XkMy3",
        },
        user: {
          username: "Wraithers",
          address: "0x31A4C53BE2356b09220D348508B97Ed9b26a6c30",
          imageUrl:
            "https://cdn.discordapp.com/avatars/206160756889223169/0eef498b5e45b99da0c7b8a43297173c.jpg",
        },
        reviewer: {
          username: "ross",
          address: "0x1C0Aa8cCD568d90d61659F060D1bFb1e6f855A20",
          imageUrl: "https://storage.googleapis.com/assets.dework.xyz/uploads/22891fb9-4358-4c40-8c48-6a228770924a/MamfzGU_400x400.jpg",
        },
      }}
    />
  </div>
);
*/

export default Page;
