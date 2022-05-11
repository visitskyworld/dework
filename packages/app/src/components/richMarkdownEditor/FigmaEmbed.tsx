import React, { FC } from "react";

export const isFigmaUrl = (url: string) =>
  /https:\/\/([\w.-]+\.)?figma.com\/(file|proto)\/([0-9a-zA-Z]{22,128})(?:\/.*)?$/.test(
    url
  );

interface Props {
  url: string;
}

export const FigmaEmbed: FC<Props> = ({ url }) => (
  <iframe
    title="Figma Embed"
    height="300"
    width="100%"
    src={`https://www.figma.com/embed?embed_host=dework&url=${url}`}
    allowFullScreen
  />
);
