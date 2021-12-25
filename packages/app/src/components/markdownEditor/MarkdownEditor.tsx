import React, { ClipboardEvent, FC, useCallback, useState } from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import * as Icons from "@ant-design/icons";
import { Upload, notification, Button, Typography } from "antd";
import { UploadRequestOption } from "rc-upload/lib/interface";
import { useUploadImage } from "../../containers/fileUploads/hooks";
import { getMarkdownImgPlaceholder, getMarkdownImgURL } from "./utils";
import { MDEditor } from "./MDEditor";
import { useToggle } from "@dewo/app/util/hooks";
import { stopPropagation } from "@dewo/app/util/eatClick";
interface MarkdownEditorProps {
  initialValue?: string | undefined;
  editable: boolean;
  mode: "create" | "update";
  autoSave?: boolean;
  onChange?(description: string | undefined): void;
  onSave?(): void;
}

export const MarkdownEditor: FC<MarkdownEditorProps> = ({
  initialValue,
  editable,
  mode,
  onChange,
  onSave,
}) => {
  const uploadImage = useUploadImage();

  const [savedValue, setSavedValue] = useState(initialValue);
  const [value, setValue] = useState(initialValue);
  const editing = useToggle(mode === "create");
  const autoSave = mode === "create";

  const handleSave = useCallback(() => {
    setSavedValue(value);
    editing.toggleOff();
    onChange?.(value);
    onSave?.();
  }, [editing, onChange, onSave, value]);

  const handleEdit = useCallback(() => {
    setValue(savedValue);
    editing.toggleOn();
  }, [savedValue, editing]);

  const handleChange = useCallback(
    (description: string | undefined) => {
      setValue(description);
      if (autoSave) onChange?.(value);
    },
    [autoSave, onChange, value]
  );

  const replaceMarkdownImgPlaceholder = useCallback(
    (placeholderText: string, url: string) =>
      setValue((prevValue) => prevValue?.replace(placeholderText, url)),
    []
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

  const renderPreview = useCallback(() => {
    if (!savedValue) {
      return (
        <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
          No description...
        </Typography.Paragraph>
      );
    }

    if (!MDEditor) return null;
    return (
      <MDEditor
        value={savedValue}
        hideToolbar
        enableScroll={false}
        previewOptions={{ linkTarget: "_blank" }}
        className="dewo-md-editor"
        preview="preview"
      />
    );
  }, [savedValue]);

  if (editing.isOn) {
    return (
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
          onChange={handleChange}
          className="dewo-md-editor"
          highlightEnable={false}
          hideToolbar
          preview="edit"
          enableScroll={false}
          autoFocus={mode === "update"}
          textareaProps={{ placeholder: "Enter a description..." }}
          onPaste={handleFilePaste}
          onBlur={stopPropagation}
          onSave={!autoSave ? handleSave : undefined}
          onCancel={!autoSave ? editing.toggleOff : undefined}
        />
      </Upload.Dragger>
    );
  } else {
    return (
      <>
        {renderPreview()}
        {!!editable && (
          <Button
            size="small"
            type="ghost"
            icon={<Icons.EditOutlined />}
            style={{ marginTop: 8 }}
            onClick={handleEdit}
          >
            Edit description
          </Button>
        )}
      </>
    );
  }
};
