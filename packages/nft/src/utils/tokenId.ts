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
  PaymentMethodType,
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
  >({ query: Queries.getTaskNFT, variables: { tokenId, contractId } });

  if (!res.data) {
    throw new Error("Token not found");
  }

  const nft = res.data.nft;
  const url = `${nft.task.project.organization.permalink}/board?taskId=${nft.task.id}`;
  return {
    name: nft.task.name,
    description: `Task details: ${url}`,
    background_color: "00042d",
    external_url: url,
    image: await getImageUrl(origin, contractId, tokenId),
    attributes: [
      {
        trait_type: "DAO",
        value: nft.task.project.organization.name,
      },
      {
        trait_type: "Completed At",
        display_type: "date",
        value: moment(nft.task.doneAt).unix(),
      },
    ],
  };
}

function getTaskUser(user: User): TaskUser {
  const threepidAddress = user.threepids.find(
    (t) => t.source === ThreepidSource.metamask
  )?.threepid;
  const paymentMethodAddress = user.paymentMethods.find(
    (pm) => pm.type === PaymentMethodType.METAMASK
  )?.address;
  return {
    username: user.username,
    address: threepidAddress ?? paymentMethodAddress,
    imageUrl: user.imageUrl ?? undefined,
  };
}

export async function getTaskData(
  tokenId: number,
  contractId: string
): Promise<TaskData> {
  const apolloClient = createApolloClient();
  const res = await apolloClient.query<
    GetTaskNFTMetadataQuery,
    GetTaskNFTMetadataQueryVariables
  >({
    query: Queries.getTaskNFT,
    variables: { tokenId, contractId },
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
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      url: `${origin}/render/${contractId}/${tokenId}`,
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
