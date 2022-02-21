import moment from "moment";
import getConfig from "next/config";
import { ApolloClient } from "@apollo/client/core";
import { InMemoryCache } from "@apollo/client/cache";
import * as Queries from "@dewo/nft/graphql/queries";
import * as URL from "url";
import { Metadata, TaskData, TaskUser } from "./types";
import {
  GetTaskNFTMetadataQuery,
  GetTaskNFTMetadataQueryVariables,
  ThreepidSource,
  User,
} from "../graphql/types";

const apiUrl = getConfig().serverRuntimeConfig.API_URL;
const screenshotterUrl = getConfig().serverRuntimeConfig.SCREENSHOTTER_URL;

function createApolloClient() {
  return new ApolloClient({
    uri: `${apiUrl}/graphql`,
    cache: new InMemoryCache(),
  });
}

export async function getTokenMetadata(
  origin: string,
  contractId: string,
  tokenId: number
): Promise<Metadata | undefined> {
  const apolloClient = createApolloClient();
  const res = await apolloClient.query<
    GetTaskNFTMetadataQuery,
    GetTaskNFTMetadataQueryVariables
  >({ query: Queries.getTaskNFT, variables: { tokenId } });

  if (!res.data) {
    throw new Error("Token not found");
  }

  return {
    name: res.data.nft.task.name,
    description: `Task details: ${res.data.nft.permalink}`,
    background_color: "00042d",
    external_url: res.data.nft.permalink,
    image: await getImageUrl(origin, contractId, tokenId),
    attributes: [
      {
        trait_type: "DAO",
        value: res.data.nft.task.project.organization.name,
      },
      {
        trait_type: "Completed At",
        display_type: "date",
        value: moment(res.data.nft.task.doneAt).unix(),
      },
    ],
  };
}

function getTaskUser(user: User): TaskUser {
  return {
    username: user.username,
    address: user.threepids.find((t) => t.source === ThreepidSource.metamask)
      ?.threepid,
    imageUrl: user.imageUrl ?? undefined,
  };
}

export async function getTaskData(tokenId: number): Promise<TaskData> {
  const apolloClient = createApolloClient();
  const res = await apolloClient.query<
    GetTaskNFTMetadataQuery,
    GetTaskNFTMetadataQueryVariables
  >({
    query: Queries.getTaskNFT,
    variables: { tokenId },
  });

  if (!res.data) {
    throw new Error("Token not found");
  }

  const url = URL.parse(res.data.nft.permalink);
  return {
    organization: {
      name: res.data.nft.task.project.organization.name,
      imageUrl:
        res.data.nft.task.project.organization.imageUrl ??
        "https://app.dework.xyz/logo.png",
    },
    task: {
      name: res.data.nft.task.name,
      doneAt: res.data.nft.task.doneAt!,
      permalink: [url.host, url.path].join(""),
    },
    user: getTaskUser(res.data.nft.assignee),
    reviewer: !!res.data.nft.owner
      ? getTaskUser(res.data.nft.owner)
      : undefined,
  };
}

export async function getImageUrl(
  origin: string,
  contractId: string,
  tokenId: number
): Promise<string> {
  return fetch(screenshotterUrl, {
    method: "POST",
    body: JSON.stringify({
      url: `${origin}/render/${tokenId}`,
      name: `${contractId}/${tokenId}`,
      viewport: {
        width: 318,
        height: 468,
        deviceScaleFactor: 2,
      },
    }),
  })
    .then((res) => res.json())
    .then((res) => res.url);
}
