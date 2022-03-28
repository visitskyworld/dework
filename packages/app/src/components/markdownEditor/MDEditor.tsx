import React from "react";
import { MDEditorProps } from "@uiw/react-md-editor";
import { Row, Skeleton, Typography } from "antd";
import dynamic from "next/dynamic";
import { MarkdownEditorButtons } from "./MarkdownEditorButtons";

interface Props extends MDEditorProps {
  disabled?: boolean;
  onSave?(): void;
  onCancel?(): void;
}

export const MDEditor = dynamic<Props>(
  () =>
    import("@uiw/react-md-editor").then((Module) => {
      return (props) => (
        <>
          <Module.default {...props} />
          {props.preview === "edit" && (
            <div className="dewo-md-editor-footer">
              <Row align="middle">
                <Typography.Text
                  type="secondary"
                  italic
                  className="ant-typography-caption"
                  style={{ opacity: 0.5, flex: 1, textAlign: "left" }}
                >
                  Markdown & any file drag-and-drop supported
                </Typography.Text>
                <MarkdownEditorButtons
                  disabled={props.disabled}
                  onCancel={props.onCancel}
                  onSave={props.onSave}
                />
              </Row>
            </div>
          )}
        </>
      );
    }),
  {
    ssr: false,
    loading: () => <Skeleton.Button active block />,
  }
);
