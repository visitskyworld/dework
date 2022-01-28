import { Fixtures } from "@dewo/api/testing/Fixtures";
import { getTestApp } from "@dewo/api/testing/getTestApp";
import { INestApplication } from "@nestjs/common";
// import notion from "notion-markdown";
import fetch from "node-fetch";

//  https://www.notion.so/dafant/e25d7a9ff7134f47886ea7c39850ca3c?v=64f8d828b3154b2ea637fb5a2ee706a9
const notionAccessToken = "secret_bhngdff7xfTQ6XxZbT1SckwPXH5VfEVL6VUSiiPuObV";

describe("NotionImportService", () => {
  let app: INestApplication;
  let fixtures: Fixtures;
  // let service: NotionImportService;

  beforeAll(async () => {
    app = await getTestApp();
    fixtures = app.get(Fixtures);
    // service = app.get(NotionImportService);
  });

  afterAll(() => app.close());

  describe("createTasksFromNotionPage", () => {
    it("testing", async () => {
      console.warn("wao");

      await fetch("https://www.notion.so/api/v3/loadPageChunk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // cookie: `token_v2=<your cookie>`,
        },
        body: JSON.stringify({
          // https://citydao.notion.site/654ed0dc7bb84dd386a2142088c3341b?v=af6887ffe8eb469985c5c275cefb22f2
          // pageId: "654ed0dc7bb84dd386a2142088c3341b",
          pageId: "af6887ffe8eb469985c5c275cefb22f2",
          limit: 50, // notion default setting,
          cursor: { stack: [] },
          chunkNumber: 0,
          verticalColumns: false,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          // Please put the contents of `res.recordMap.block` in the notion function.
          // console.log(notion(Object.values(res.recordMap.block)));

          // console.warn(res.recordMap.block);
          console.warn(res);
        });
    });
  });
});
