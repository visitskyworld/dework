import moment from "moment";
import { Metadata } from "./types";

export function getTokenMetadata(tokenId: number): Metadata | undefined {
  if (tokenId === 1) {
    return {
      name: "Create an onboarding template",
      description: `Task details: https://app.dework.xyz/o/nil-6Tyzir1XgFUBFspUT1S9gl/board?taskId=84506e2a-4c1e-4e1b-a91f-beec01dabd1f`,
      background_color: "00042d",
      external_url: "https://app.dework.xyz/o/nil-6Tyzir1XgFUBFspUT1S9gl/board?taskId=84506e2a-4c1e-4e1b-a91f-beec01dabd1f",
      // image: `http://localhost:1155/api/token/${tokenId}/image.png`,
      // image: `https://nft-gctfxajdoa-ue.a.run.app/api/token/${tokenId}/image.png`, // demo
      image: `https://nft.dework.xyz/api/token/${tokenId}/image.png`, // prod
      attributes: [
        { trait_type: "DAO", value: "NIL" },
        {
          trait_type: "Completed At",
          display_type: "date",
          value: moment("2022-02-17").unix(),
        },
      ],
    };
  }
}
