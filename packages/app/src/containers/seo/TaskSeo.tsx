import { TaskDetails } from "@dewo/app/graphql/types";
import { NextSeo } from "next-seo";
import React, { FC } from "react";
import * as qs from "query-string";

interface Props {
  task: TaskDetails;
}

export const TaskSeo: FC<Props> = ({ task }) => {
  const title = `${task.name} | Dework`;
  const description = `Read more about this task from ${task.project.organization.name} on Dework!`;
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
              task.name
            )}.png?${qs.stringify({
              subtitle: [
                task.project.organization.name,
                task.project.name,
              ].join(" / "),
              md: 1,
              fontSize: "100px",
              images:
                task.project.organization.imageUrl ??
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
