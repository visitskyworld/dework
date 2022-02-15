import { OrganizationDetails } from "@dewo/app/graphql/types";
import { NextSeo } from "next-seo";
import React, { FC } from "react";
import * as qs from "query-string";

interface Props {
  organization: OrganizationDetails;
}

export const OrganizationSeo: FC<Props> = ({ organization }) => {
  const title = `${organization.name} | Dework`;
  const description =
    organization.tagline || `Read more about ${organization.name} on Dework!`;
  return (
    <NextSeo
      title={title}
      description={description}
      openGraph={{
        title,
        description,
        site_name: "Dework",
        images: [
          {
            url: `https://dework-og-image-fant.vercel.app/**${encodeURIComponent(
              organization.name
            )}**.png?${qs.stringify({
              description,
              md: 1,
              fontSize: "100px",
              images:
                organization.imageUrl ?? "https://app.dework.xyz/logo.png",
              widths: 300,
              heights: 300,
            })}`,
          },
        ],
      }}
      twitter={{ site: "@deworkxyz", cardType: "summary_large_image" }}
    />
  );
};
