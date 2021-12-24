import React, { ClipboardEvent, FC, useCallback, useState } from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { Upload, Tabs, notification } from "antd";

import { UploadRequestOption } from "rc-upload/lib/interface";
import { useUploadImage } from "../../containers/fileUploads/hooks";
import { getMarkdownImgPlaceholder, getMarkdownImgURL } from "./utils";
import { MDEditor } from "./MDEditor";
const { TabPane } = Tabs;

interface MarkdownEditorProps {
  initialValue?: string | undefined;
  onChange?(description: string | undefined): void;
  editable: boolean;
  mode: "create" | "update";
}
export const MarkdownEditor: FC<MarkdownEditorProps> = ({
  initialValue,
  onChange,
  editable,
  mode,
}) => {
  const uploadImage = useUploadImage();
  const [value, setValue] = useState<string | undefined>(initialValue);

  const replaceMarkdownImgPlaceholder = useCallback(
    (placeholderText: string, url: string) => {
      setValue((prevValue) => prevValue?.replace(placeholderText, url));
      onChange?.(`${value}\n\n${url}`);
    },
    [value, onChange]
  );

  const removeMarkdownImgPlaceholder = useCallback(
    (placeholderText: string) => {
      setValue((prevValue) => prevValue?.replace(placeholderText, ""));
    },
    []
  );
  const addMarkdownImgPlaceholder = useCallback((placeholderText: string) => {
    setValue(
      (prevValue) =>
        `${prevValue} ${
          prevValue && prevValue?.trim()?.length > 0 ? "\n\n" : ""
        } ${placeholderText}`
    );
  }, []);
  const uploadAndAddImage = useCallback(
    async (file: File) => {
      const placeholderText = getMarkdownImgPlaceholder(file);
      addMarkdownImgPlaceholder(placeholderText);

      try {
        const imgUrl = await uploadImage(file);
        const url = getMarkdownImgURL(file.name, imgUrl);
        replaceMarkdownImgPlaceholder(placeholderText, url);
      } catch (e) {
        removeMarkdownImgPlaceholder(placeholderText);

        notification.error({
          message: "Failed to upload",
        });
      }
    },
    [
      replaceMarkdownImgPlaceholder,
      addMarkdownImgPlaceholder,
      uploadImage,
      removeMarkdownImgPlaceholder,
    ]
  );
  const handleChangeValue = useCallback(
    (description: string | undefined) => {
      setValue(description);
      onChange?.(description);
    },
    [onChange]
  );
  const handleFileDropped = useCallback(
    (data: UploadRequestOption) => {
      uploadAndAddImage(data.file as File);
    },
    [uploadAndAddImage]
  );
  const handleFilePaste = useCallback(
    (data: ClipboardEvent) => {
      if (data.clipboardData.files.length > 0) {
        const file = data.clipboardData.files[0];
        if (file.type.includes("image/")) uploadAndAddImage(file);
      }
    },
    [uploadAndAddImage]
  );

  const renderPreview = useCallback(
    () =>
      MDEditor && (
        <MDEditor
          value={value}
          hideToolbar
          enableScroll={false}
          previewOptions={{ linkTarget: "_blank" }}
          className={`dewo-md-editor ${
            !editable ? "dewo-md-editor-preview-only" : ""
          }`}
          preview="preview"
        />
      ),
    [value, editable]
  );
  if (!editable) return renderPreview();
  return (
    <Tabs
      defaultActiveKey={mode === "create" ? "editor" : "preview"}
      tabBarStyle={{ marginBottom: 0 }}
    >
      <TabPane tab="Editor" key="editor">
        <Upload.Dragger
          openFileDialogOnClick={false}
          showUploadList={false}
          maxCount={1}
          customRequest={handleFileDropped}
          className="dewo-md-upload"
          accept="image/*"
        >
          <MDEditor
            value={value}
            onChange={handleChangeValue}
            className="dewo-md-editor"
            highlightEnable={false}
            hideToolbar
            preview="edit"
            enableScroll={false}
            placeholder="Enter a description..."
            onPaste={handleFilePaste}
          />
        </Upload.Dragger>
      </TabPane>
      <TabPane tab="Preview" key="preview">
        {renderPreview()}
      </TabPane>
    </Tabs>
  );
};
