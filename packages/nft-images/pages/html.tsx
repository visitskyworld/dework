import React from "react";
import { NFT } from "../components/NFT";

const Page = () => (
  <div style={{ display: "grid", placeItems: "center" }}>
    <NFT
      width={300}
      height={450}
      data={{
        organization: {
          name: "CityDAO",
          imageUrl:
            "https://pbs.twimg.com/profile_images/1428485179807391746/fYVHRZ3B_400x400.jpg",
        },
        task: {
          name: "Generate Parcel Explorer Images",
          // name: "Reallylongwordwithoutabreak is cool",
          doneAt: new Date().toISOString(),
          permalink: "https://fant.io",
        },
        user: {
          username: "fant",
          address: "0x761996F7258A19B6aCcF6f22e9Ca8CdAA92D75A6",
          imageUrl:
            "https://storage.googleapis.com/assets.dework.xyz/uploads/e500560c-8892-478c-9bf8-a6c041b5ad9d/memed-io-output.jpeg",
        },
        reviewer: {
          username: "lonis",
          address: "0x761996F7258A19B6aCcF6f22e9Ca8CdAA92D75A6",
          imageUrl: "https://avatars.githubusercontent.com/u/52952537?v=4",
        },
      }}
    />
  </div>
);

export default Page;
