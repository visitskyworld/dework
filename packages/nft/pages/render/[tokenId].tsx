import React from "react";
import { NextComponentType, NextPageContext } from "next";
import { TaskData } from "@dewo/nft/utils/types";
import { getTaskData } from "@dewo/nft/utils/tokenId";
import { NFT } from "@dewo/nft/components/NFT";

interface Props {
  data: TaskData;
}

const Page: NextComponentType<NextPageContext, Props, Props> = ({ data }) => (
  <div style={{ display: "grid", placeItems: "center" }}>
    <NFT width={300} height={450} data={data} />
  </div>
);

Page.getInitialProps = async (ctx) => {
  const tokenId = parseInt(ctx.query.tokenId as string);
  return { data: await getTaskData(tokenId) };
};

export default Page;
