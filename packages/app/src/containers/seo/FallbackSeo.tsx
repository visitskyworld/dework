import { siteDescription, siteTitle } from "@dewo/app/util/constants";
import { DefaultSeo } from "next-seo";
import React, { FC } from "react";
import * as qs from "query-string";

export const FallbackSeo: FC = () => (
  <DefaultSeo
    title={siteTitle}
    description={siteDescription}
    openGraph={{
      type: "website",
      title: siteTitle,
      description: siteDescription,
      // images: [{ url: "https://i.imgur.com/vs0aXnL.png" }],
      images: [
        {
          url: `https://dework-og-image-fant.vercel.app/**${encodeURIComponent(
            siteTitle
          )}**.png?${qs.stringify({
            description: siteDescription,
            md: 1,
            fontSize: "100px",
            images: [{ url: "https://app.dework.xyz/logo.png" }],
            widths: 300,
            heights: 300,
          })}`,
        },
      ],
    }}
    twitter={{ cardType: "summary_large_image", site: "@deworkxyz" }}
  />
);
