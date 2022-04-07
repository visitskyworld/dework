import React from "react";
import { Props } from "rich-markdown-editor";
import { Skeleton } from "antd";
import dynamic from "next/dynamic";

export const RichMarkdownComponent = dynamic<Props>(
  () =>
    import("rich-markdown-editor").then((Module) => {
      return (props) => (
        /* eslint-disable-next-line */
        <Module.default {...props} />
      );
    }),
  {
    ssr: false,
    loading: () => <Skeleton.Button active block />,
  }
);
