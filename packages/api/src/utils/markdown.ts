const imagesRegex = /!\[.+?\]\((.+?)\)/g;
export const getMarkdownImages = (text: string) => {
  return Array.from(text.matchAll(imagesRegex)).map((m) => m[1]);
};
