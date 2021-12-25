import React from "react";
import { MDEditorProps } from "@uiw/react-md-editor";
import { Button, Row, Skeleton, Typography } from "antd";
import dynamic from "next/dynamic";

interface Props extends MDEditorProps {
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
                  Markdown formatting and file drag-and-drop supported
                </Typography.Text>
                <Button
                  size="small"
                  type="text"
                  style={{ marginRight: 8 }}
                  onClick={props.onCancel}
                >
                  <Typography.Text type="secondary">Cancel</Typography.Text>
                </Button>
                <Button size="small" type="primary" onClick={props.onSave}>
                  Save
                </Button>
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
