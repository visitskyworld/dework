import { User } from "@dewo/app/graphql/types";
import { NextSeo } from "next-seo";
import React, { FC } from "react";
import * as qs from "query-string";

interface Props {
  user: User;
}

export const UserSeo: FC<Props> = ({ user }) => {
  const title = `${user.username} | Dework`;
  const description = `Read more about ${user.username} on Dework!`;
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
            url: `https://dework-og-image-fant.vercel.app/${encodeURIComponent(
              user.username
            )}.png?${qs.stringify({
              subtitle: description,
              md: 1,
              fontSize: "100px",
              images: user.imageUrl ?? "https://app.dework.xyz/logo.png",
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
