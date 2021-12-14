export const queryToString = (query: string | string[] | any | any[]): string =>
  Array.isArray(query) ? query[0] : query;
