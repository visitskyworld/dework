import React from "react";
import { MDEditorProps } from "@uiw/react-md-editor";
import { Skeleton, Typography } from "antd";
import dynamic from "next/dynamic";
export const MDEditor = dynamic<MDEditorProps>(
  () =>
    import("@uiw/react-md-editor").then((Module) => {
      return (props) => (
        <>
          <Module.default {...props} />
          {props.preview === "edit" && (
            <div className="dewo-md-editor-footer">
              <Typography.Text
                type="secondary"
                italic
                className="ant-typography-caption"
                style={{ opacity: 0.5 }}
              >
                Attach files by dragging {"&"} dropping, selecting or pasting
                them
              </Typography.Text>
            </div>
          )}
        </>
      );
    }),
  {
    ssr: false,
    loading: () => <Skeleton.Button active block style={{ height: 170 }} />,
  }
);
