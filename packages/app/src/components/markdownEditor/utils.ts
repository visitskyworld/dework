export const getMarkdownImgPlaceholder = (file: File): string => {
  return `![${file.name}](${file.lastModified}-${file.name}) `;
};
export const getMarkdownURL = (fileName: string, url: string): string => {
  return `[${fileName}](${url})`;
};
