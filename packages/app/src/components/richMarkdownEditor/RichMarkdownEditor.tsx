import React, { FC, useCallback, useEffect, useState } from "react";
import { RichMarkdownComponent } from "./RichMarkdownComponent";
import { useUploadFile } from "@dewo/app/containers/fileUploads/hooks";
import { MarkdownEditorButtons } from "../markdownEditor/MarkdownEditorButtons";
import { useToggle } from "@dewo/app/util/hooks";
import { message, Row, Typography } from "antd";
import router from "next/router";
import { FigmaEmbed, isFigmaUrl } from "../markdownEditor/FigmaEmbed";
import DefaultTooltip from "rich-markdown-editor/dist/components/Tooltip";
import { useDropHandler } from "./utils";
import { isLocalURL } from "next/dist/shared/lib/router/router";
import { theme } from "./theme";
import { eatClick } from "@dewo/app/util/eatClick";

const FigmaWrapper: FC<{
  attrs: {
    href: string;
  };
}> = ({ attrs }) => <FigmaEmbed url={attrs.href} />;

interface RichMarkdownEditorProps {
  initialValue: string;
  onChange?(description: string | undefined): void;
  onSave?(description: string | undefined): void;
  mode: "create" | "update";
  editable: boolean;
}
export const RichMarkdownEditor: FC<RichMarkdownEditorProps> = ({
  initialValue,
  onChange,
  onSave,
  mode,
  editable,
}) => {
  const uploadFile = useUploadFile();
  const autosave = mode === "create";

  const [value, setValue] = useState(initialValue);
  const [savedValue, setSavedValue] = useState(value);
  const isEditing = useToggle(mode === "create");

  useEffect(() => {
    if (autosave) onChange?.(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, autosave]);

  const handleChange = useCallback((value: () => string) => {
    try {
      const val = value();
      setValue(val);
    } catch (e) {
      // Sometimes throws on first "edit". Keeps working after so no issue
      console.error(e);
    }
  }, []);

  const handleSave = useCallback(
    (e) => {
      if (e) eatClick(e);
      isEditing.toggleOff();
      onChange?.(value);
      onSave?.(value);
      setSavedValue(value);
    },
    [isEditing, onChange, onSave, value]
  );

  const handleCancel = useCallback(
    (e) => {
      if (e) eatClick(e);
      isEditing.toggleOff();
      setSavedValue(savedValue);
    },
    [isEditing, savedValue]
  );

  const handleLinkClick = useCallback(
    (href: string) => {
      if (isEditing.isOn) return;
      if (isLocalURL(href)) {
        return router.push(href);
      }
      window.open(href, "_blank");
    },
    [isEditing.isOn]
  );

  const dropHandler = useDropHandler();

  const Editor = (
    <RichMarkdownComponent
      tooltip={DefaultTooltip}
      uploadImage={async (file) => {
        const isLt2M = file.size / 1024 / 1024 < 40;
        if (!isLt2M) {
          message.error("File must be smaller than 40MB.");
          throw new Error("File must be smaller than 40MB.");
        }
        const url = await uploadFile(file);
        return url;
      }}
      onChange={handleChange}
      defaultValue={savedValue}
      embeds={[
        {
          title: "Figma Preview",
          keywords: "figma",
          defaultHidden: false,
          matcher: isFigmaUrl,
          component: FigmaWrapper,
        },
      ]}
      theme={theme}
      placeholder="Write your description here"
      onClickLink={handleLinkClick}
      readOnly={!editable}
      disableExtensions={["emoji"]}
      handleDOMEvents={{ drop: dropHandler }}
    />
  );

  if (!editable) {
    return Editor;
  }

  return (
    <div
      onClick={isEditing.toggleOn}
      className="ant-input dewo-field dewo-field-focus-border"
      style={{ paddingLeft: 4 }}
    >
      {Editor}
      <Row
        style={{
          marginTop: 8,
          visibility:
            isEditing.isOn && savedValue !== value ? "visible" : "hidden",
        }}
        align="middle"
      >
        <Typography.Text
          type="secondary"
          italic
          className="text-secondary"
          style={{ flex: 1, textAlign: "left" }}
        >
          Markdown & any file drag-and-drop supported
        </Typography.Text>
        {mode === "update" && (
          <MarkdownEditorButtons onCancel={handleCancel} onSave={handleSave} />
        )}
      </Row>
    </div>
  );
};
