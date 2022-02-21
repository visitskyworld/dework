import React from "react";
import getConfig from "next/config";
import Head from "next/head";
import { NextComponentType, NextPageContext } from "next";
import { TaskData } from "@dewo/nft/utils/types";
import { getTaskData } from "@dewo/nft/utils/tokenId";
import { NFT } from "@dewo/nft/components/NFT";

interface Props {
  data: TaskData;
}

const Page: NextComponentType<NextPageContext, Props, Props> = ({ data }) => (
  <>
    <Head>
      <style>
        {`
          @font-face {
            font-family: 'Avenir Next';
            font-weight: normal;
            src: url(data:font/otf;charset=utf-8;base64,${
              getConfig().publicRuntimeConfig.FONT_AVENIR_REGULAR_BASE64
            }) format('opentype');
          }
          
          @font-face {
            font-family: 'Avenir Next';
            font-weight: bold;
            src: url(data:font/otf;charset=utf-8;base64,${
              getConfig().publicRuntimeConfig.FONT_AVENIR_BOLD_BASE64
            }) format('opentype');
          }
        `}
      </style>
    </Head>
    <div style={{ display: "grid", placeItems: "center" }}>
      <NFT width={300} height={450} data={data} />
    </div>
  </>
);

Page.getInitialProps = async (ctx) => {
  const tokenId = parseInt(ctx.query.tokenId as string);
  const contractId = ctx.query.contractId as string;
  return { data: await getTaskData(tokenId, contractId) };
};

export default Page;
