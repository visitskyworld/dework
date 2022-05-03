import { ProjectDetails } from "@dewo/app/graphql/types";
import { NextSeo } from "next-seo";
import React, { FC } from "react";
import * as qs from "query-string";

interface Props {
  project: ProjectDetails;
}

export const ProjectSeo: FC<Props> = ({ project }) => {
  const title = `${project.name} | Dework`;
  const description = `Read more about ${project.name} from ${project.organization.name} on Dework!`;
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
              project.name
            )}.png?${qs.stringify({
              subtitle: project.organization.name,
              md: 1,
              fontSize: "100px",
              images:
                project.organization.imageUrl ??
                "https://app.dework.xyz/logo.png",
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
