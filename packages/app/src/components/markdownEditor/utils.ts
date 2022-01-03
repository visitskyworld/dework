export const getMarkdownImgPlaceholder = (file: File): string => {
  return `![${file.name}](${file.lastModified}-${file.name}) `;
};
export const getMarkdownURL = (file: File, url: string): string => {
  return (file.type.includes("image/") ? "!" : "") + `[${file.name}](${url})`;
};
