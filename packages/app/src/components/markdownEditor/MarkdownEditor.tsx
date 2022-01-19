import React, {
  ChangeEvent,
  ClipboardEvent,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import * as Icons from "@ant-design/icons";
import { Upload, notification, Button, message } from "antd";
import { UploadRequestOption } from "rc-upload/lib/interface";
import { useUploadFile } from "../../containers/fileUploads/hooks";
import { getMarkdownImgPlaceholder, getMarkdownURL } from "./utils";
import { MDEditor } from "./MDEditor";
import { useToggle } from "@dewo/app/util/hooks";
import { stopPropagation } from "@dewo/app/util/eatClick";
import { MarkdownPreview } from "./MarkdownPreview";
import * as commands from "@uiw/react-md-editor/lib/commands";
interface MarkdownEditorProps {
  initialValue?: string | undefined;
  placeholder?: string;
  buttonText?: string;
  editable?: boolean;
  mode: "create" | "update";
  autoSave?: boolean;
  onChange?(description: string | undefined): void;
  onSave?(description: string | undefined): void;
}

export const MarkdownEditor: FC<MarkdownEditorProps> = ({
  initialValue,
  placeholder = "Write something or attach files...",
  buttonText = "Edit",
  editable,
  mode,
  onChange,
  onSave,
}) => {
  const uploadFile = useUploadFile();

  const [savedValue, setSavedValue] = useState(initialValue);
  const [value, setValue] = useState(initialValue);
  const editing = useToggle(mode === "create");
  const autoSave = mode === "create";
  const fileRef = useRef<HTMLInputElement>();
  const handleSave = useCallback(() => {
    setSavedValue(value);
    editing.toggleOff();
    onChange?.(value);
    onSave?.(value);
  }, [editing, onChange, onSave, value]);

  const handleEdit = useCallback(() => {
    setValue(savedValue);
    editing.toggleOn();
  }, [savedValue, editing]);

  useEffect(() => {
    if (autoSave) onChange?.(value);
  }, [autoSave, onChange, value]);

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
        `${prevValue ?? ""} ${
          !!prevValue?.trim()?.length ? "\n\n" : ""
        } ${placeholderText}`
    );
  }, []);
  const uploadAndAddFile = useCallback(
    async (file: File) => {
      const placeholderText = getMarkdownImgPlaceholder(file);
      addMarkdownImgPlaceholder(placeholderText);

      try {
        const imgUrl = await uploadFile(file);
        const url = getMarkdownURL(file, imgUrl);
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
      uploadFile,
      removeMarkdownImgPlaceholder,
    ]
  );

  const handleFileDropped = useCallback(
    (data: UploadRequestOption) => {
      uploadAndAddFile(data.file as File);
    },
    [uploadAndAddFile]
  );

  const handleFilePaste = useCallback(
    (data: ClipboardEvent) => {
      if (data.clipboardData.files.length > 0) {
        const file = data.clipboardData.files[0];
        if (file.type.includes("image/")) uploadAndAddFile(file);
      }
    },
    [uploadAndAddFile]
  );

  const beforeUpload = useCallback((file: File) => {
    const isLt2M = file.size / 1024 / 1024 < 40;
    if (!isLt2M) {
      message.error("File must be smaller than 40MB.");
    }
    return isLt2M;
  }, []);
  const handleToolbarFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event?.target?.files?.length) {
        const file = event?.target?.files[0];
        if (beforeUpload(file)) uploadAndAddFile(file);
      }
    },
    [uploadAndAddFile, beforeUpload]
  );
  const newCommands = useMemo(
    () =>
      commands.getCommands().map((command) =>
        command.name === "image"
          ? {
              ...commands.image,
              execute: () => {
                fileRef?.current?.click();
              },
            }
          : command
      ),
    [fileRef]
  );
  if (editing.isOn) {
    return (
      <Upload.Dragger
        openFileDialogOnClick={false}
        showUploadList={false}
        maxCount={1}
        customRequest={handleFileDropped}
        className="dewo-md-upload"
        beforeUpload={beforeUpload}
      >
        {/* input for uploading img from toolbar upload button */}
        <input
          type="file"
          id="file-input"
          ref={fileRef as React.LegacyRef<HTMLInputElement>}
          onChange={handleToolbarFile}
          style={{ display: "none" }}
        />
        <MDEditor
          value={value}
          onChange={setValue}
          className="dewo-md-editor"
          highlightEnable={false}
          commands={newCommands}
          extraCommands={[]}
          preview="edit"
          enableScroll={false}
          autoFocus={mode === "update"}
          textareaProps={{ placeholder }}
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
        <MarkdownPreview value={savedValue} placeholder={placeholder} />
        {!!editable && (
          <Button
            size="small"
            type="ghost"
            icon={<Icons.EditOutlined />}
            style={{ marginTop: 8 }}
            onClick={handleEdit}
          >
            {buttonText}
          </Button>
        )}
      </>
    );
  }
};
