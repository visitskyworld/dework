import DefaultTheme, { dark } from "rich-markdown-editor/dist/styles/theme";

const textColor = "rgba(255, 255, 255, 0.85)";

// Fix for a bug with the block menu always only using the default styling.
// @ts-ignore
DefaultTheme.blockToolbarIcon = "rgba(255, 255, 255, 0.5)";
DefaultTheme.blockToolbarIconSelected = textColor;

export const theme: typeof DefaultTheme = {
  ...dark,

  text: textColor,
  placeholder: "rgba(255, 255, 255, 0.3)",
  textSecondary: "rgba(255, 255, 255, 0.5)",
  background: "none",

  code: "#c5c8c6",
  codeBackground: "#282828",
  codeBorder: "#00000000",
  codeTag: "#000000",

  toolbarBackground: "#333",
  toolbarItem: textColor,

  blockToolbarBackground: "#333",
  blockToolbarItem: textColor,
  blockToolbarText: "rgba(255, 255, 255, 0.5)",
  blockToolbarSelectedBackground: "#444",
  blockToolbarHoverBackground: "#444",
  blockToolbarTextSelected: "white",
  blockToolbarIconSelected: "white",
  blockToolbarTrigger: "white",
  blockToolbarTriggerIcon: "white",
  blockToolbarDivider: "#555",

  zIndex: 5000,
};
