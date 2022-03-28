// https://stackoverflow.com/a/46501346/12338002
declare module "*.less" {
  const resource: { [key: string]: string };
  export = resource;
}
