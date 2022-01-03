import React, { FC } from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { Typography } from "antd";
import { MDEditor } from "./MDEditor";

interface Props {
  value?: string;
  placeholder?: string;
}

export const MarkdownPreview: FC<Props> = ({
  value,
  placeholder = "No description...",
}) => {
  if (!value) {
    return (
      <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
        {placeholder}
      </Typography.Paragraph>
    );
  }

  if (!MDEditor) return null;
  return (
    <MDEditor
      value={value}
      hideToolbar
      enableScroll={false}
      previewOptions={{ linkTarget: "_blank" }}
      className="dewo-md-editor"
      preview="preview"
    />
  );
};
