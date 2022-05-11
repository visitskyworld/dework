import React, { FC, useCallback, useEffect, useState } from "react";
import { useUploadFile } from "@dewo/app/containers/fileUploads/hooks";
import { MarkdownEditorButtons } from "./MarkdownEditorButtons";
import { useRunning, useToggle } from "@dewo/app/util/hooks";
import { message, Row, Typography } from "antd";
import router from "next/router";
import { FigmaEmbed, isFigmaUrl } from "./FigmaEmbed";
import DefaultTooltip from "rich-markdown-editor/dist/components/Tooltip";
import { keydownHandler, useDropHandler } from "./utils";
import { isLocalURL } from "next/dist/shared/lib/router/router";
import { theme } from "./theme";
import { eatClick } from "@dewo/app/util/eatClick";
import classNames from "classnames";
import { RichMarkdownComponent } from "./RichMarkdownComponent";

const FigmaWrapper: FC<{
  attrs: {
    href: string;
  };
}> = ({ attrs }) => <FigmaEmbed url={attrs.href} />;

interface RichMarkdownEditorProps {
  initialValue: string;
  onChange?(description: string | undefined): void;
  onSave?(description: string | undefined): void;
  mode?: "create" | "update";
  editable: boolean;
  placeholder?: string;
  buttons?: FC<{
    disabled: boolean;
    onSave: (e: React.SyntheticEvent) => void;
    onCancel: (e: React.SyntheticEvent) => void;
  }>;
  bordered?: boolean;
}
export const RichMarkdownEditor: FC<RichMarkdownEditorProps> = ({
  initialValue,
  onChange,
  onSave,
  mode = "create",
  editable,
  placeholder = "Write your description here",
  buttons: Buttons = mode === "update" ? MarkdownEditorButtons : undefined,
  bordered,
}) => {
  const className = classNames([
    "ant-input",
    !bordered && "dewo-field",
    !bordered && "dewo-field-focus-border",
  ]);

  const [uploadFile, isUploading] = useRunning(useUploadFile());
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

  const [resetKey, setResetKey] = useState(0);
  const handleCancel = useCallback(
    (e) => {
      if (e) eatClick(e);
      isEditing.toggleOff();
      setValue(savedValue);
      setResetKey((i) => i + 1);
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

  const editor = (
    <RichMarkdownComponent
      key={resetKey}
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
      placeholder={placeholder}
      onClickLink={handleLinkClick}
      readOnly={!editable}
      disableExtensions={["emoji"]}
      handleDOMEvents={{
        drop: dropHandler,
        keydown: keydownHandler,
      }}
    />
  );

  if (!editable) {
    return editor;
  }

  const showSave = isEditing.isOn && savedValue !== value;
  return (
    <div
      onClick={isEditing.toggleOn}
      className={className}
      style={{ paddingLeft: 4 }}
    >
      {editor}
      <Row style={{ marginTop: 8 }} align="middle">
        <Typography.Text
          type="secondary"
          italic
          style={{
            flex: 1,
            opacity: 0.4,
            textAlign: "left",
            visibility: isEditing.isOn ? "visible" : "hidden",
          }}
        >
          Markdown & any file drag-and-drop supported
        </Typography.Text>
        {showSave && !!Buttons && (
          <Buttons
            onSave={handleSave}
            onCancel={handleCancel}
            disabled={isUploading}
          />
        )}
      </Row>
    </div>
  );
};
