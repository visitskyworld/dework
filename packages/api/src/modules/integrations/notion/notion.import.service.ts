import { TaskStatus } from "@dewo/api/models/Task";
import { TaskTag, TaskTagSource } from "@dewo/api/models/TaskTag";
import { Injectable, Logger } from "@nestjs/common";
import { Client } from "@notionhq/client";
import {
  GetBlockResponse,
  GetPageResponse,
  QueryDatabaseResponse,
  RichTextItemResponse,
  SearchResponse,
  SelectColor,
} from "@notionhq/client/build/src/api-endpoints";
import _ from "lodash";
import * as AntColors from "@ant-design/colors";
import { ProjectService } from "../../project/project.service";
import { User } from "@dewo/api/models/User";
import { TaskService } from "../../task/task.service";

@Injectable()
export class NotionImportService {
  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly projectService: ProjectService,
    private readonly taskService: TaskService
  ) {}

  private statusGuesses: Record<TaskStatus, string[]> = {
    [TaskStatus.TODO]: [
      "not started",
      "backlog",
      "todo",
      "to-do",
      "to do",
      "sprint",
    ],
    [TaskStatus.IN_PROGRESS]: ["in progress", "doing"],
    [TaskStatus.IN_REVIEW]: ["in review"],
    [TaskStatus.DONE]: ["done", "completed", "finished"],
    [TaskStatus.BACKLOG]: [],
  };

  private colorMapping: Record<SelectColor, keyof typeof AntColors> = {
    default: "grey",
    gray: "grey",
    brown: "volcano",
    orange: "orange",
    yellow: "gold",
    green: "green",
    blue: "blue",
    purple: "purple",
    pink: "magenta",
    red: "red",
  };

  public async createProjectsFromNotion(
    organizationId: string,
    authToken: string,
    user: User
  ) {
    this.logger.log(
      `Starting Notion import: ${JSON.stringify({
        organizationId,
        userId: user.id,
      })}`
    );
    const notion = new Client({ auth: authToken });

    const databases = await notion.search({
      filter: { property: "object", value: "database" },
    });

    this.logger.debug(
      `Found Notion databases: ${JSON.stringify({
        databaseIds: databases.results.map((d) => d.id),
      })}`
    );
    for (const database of databases.results) {
      this.logger.debug(
        `Fetching cards in Notion database: ${JSON.stringify({
          databaseId: database.id,
        })}`
      );

      let cards: QueryDatabaseResponse["results"] = [];
      let nextCursor: string | null | undefined;
      do {
        const result = await notion.databases.query({
          database_id: database.id,
          start_cursor: nextCursor ?? undefined,
        });
        cards.push(...result.results);
        nextCursor = result.next_cursor;
      } while (!!nextCursor);

      this.logger.debug(
        `Fetched cards from Notion database: ${JSON.stringify({
          databaseId: database.id,
          numCards: cards.length,
        })}`
      );

      const projectName =
        "title" in database
          ? database.title.map((t) => t.plain_text).join("")
          : "";
      const project = await this.projectService.create(
        { organizationId, name: projectName },
        user
      );
      const tags = await this.createTags(database, project.id);

      for (const card of cards) {
        this.logger.debug(
          `Fetching Notion card blocks: ${JSON.stringify({
            databaseId: database.id,
            cardId: card.id,
          })}`
        );

        const [page, blocks] = await Promise.all([
          notion.pages.retrieve({ page_id: card.id }),
          notion.blocks.children.list({ block_id: card.id }),
        ]);

        if (!("properties" in page)) continue;

        const name =
          page.properties.Name.type === "title"
            ? page.properties.Name.title.map((t) => t.plain_text).join("")
            : "";
        const markdown = this.blocksToMarkdown(blocks.results);
        const status = this.guessStatus(page);
        const notionTags = _(page.properties)
          .map((prop) => {
            if ("multi_select" in prop && !!prop.multi_select) {
              return prop.multi_select;
            } else if ("select" in prop && !!prop.select) {
              return [prop.select];
            }
            return [];
          })
          .flatten()
          .value();
        const taskTags = tags.filter((t) =>
          notionTags.find((nt) => nt.id === t.externalId)
        );

        this.logger.debug(
          `Creating task from Notion card: ${JSON.stringify({
            databaseId: database.id,
            cardId: card.id,
            name,
            status,
            tagIds: taskTags.map((t) => t.id),
          })}`
        );

        await this.taskService.create({
          name,
          status: status ?? TaskStatus.TODO,
          tags: taskTags,
          description: [
            markdown,
            `Originally created from Notion task: ${page.url}`,
          ]
            .join("\n\n")
            .trim(),
          projectId: project.id,
        });
      }
    }

    this.logger.log(
      `Finished Notion import: ${JSON.stringify({
        organizationId,
        userId: user.id,
      })}`
    );
  }

  private guessStatus(page: GetPageResponse): TaskStatus | undefined {
    if (!("properties" in page)) return undefined;
    const status = page.properties.Status;
    if (!status) return undefined;
    if (status.type !== "select") return undefined;
    const label = status.select?.name;
    if (!label) return undefined;
    for (const [status, guesses] of Object.entries(this.statusGuesses)) {
      if (guesses.includes(label.toLowerCase())) {
        return status as TaskStatus;
      }
    }

    return undefined;
  }

  private textToMarkdown(texts: RichTextItemResponse[]): string {
    return texts
      .map((text) => {
        if (text.type !== "text") return text.plain_text;

        let markdown = text.text.content;
        if (!!text.text.link) markdown = `[${markdown}](${text.text.link.url})`;
        if (text.annotations.bold) markdown = `**${markdown}**`;
        if (text.annotations.italic) markdown = `_${markdown}_`;
        if (text.annotations.underline) markdown = `<u>${markdown}</u>`;
        if (text.annotations.strikethrough) markdown = `~~${markdown}~~`;
        if (text.annotations.code) markdown = `\`${markdown}\``;
        return markdown;
      })
      .join("");
  }

  private blocksToMarkdown(blocks: GetBlockResponse[]): string {
    return _(blocks)
      .map((block) => {
        if (!("type" in block)) return undefined;
        switch (block.type) {
          case "heading_1":
            return `# ${this.textToMarkdown(block.heading_1.text)}`;
          case "heading_2":
            return `## ${this.textToMarkdown(block.heading_2.text)}`;
          case "heading_3":
            return `### ${this.textToMarkdown(block.heading_3.text)}`;
          case "divider":
            return `---`;
          case "paragraph":
            return `${this.textToMarkdown(block.paragraph.text)}`;
          case "to_do":
            const marker = block.to_do.checked ? "X" : " ";
            return `- [${marker}] ${this.textToMarkdown(block.to_do.text)}`;
          case "bulleted_list_item":
            return `- ${this.textToMarkdown(block.bulleted_list_item.text)}`;
          case "numbered_list_item":
            return `1. ${this.textToMarkdown(block.numbered_list_item.text)}`;
          case "quote":
            return `> ${this.textToMarkdown(block.quote.text)}`;
          case "code":
            const lang = block.code.language;
            const code = this.textToMarkdown(block.code.text);
            return `\`\`\`${lang}\n${code}\n\`\`\``;
          case "image":
            const caption = this.textToMarkdown(block.image.caption);
            const url =
              "external" in block.image
                ? block.image.external.url
                : // Note(fant): this file url expires, so we _should_ download it
                  block.image.file.url;
            return `![${caption}](${url})`;
          default:
            return undefined;
        }
      })
      .filter((line) => !!line)
      .join("\n\n");
  }

  private async createTags(
    database: SearchResponse["results"][number],
    projectId: string
  ): Promise<TaskTag[]> {
    if (!("properties" in database)) return [];
    const notionTags = _(database.properties)
      .filter((_prop, name) => name !== "Status")
      .map((prop) => {
        if ("multi_select" in prop && "options" in prop.multi_select!) {
          return prop.multi_select.options;
        } else if ("select" in prop && "options" in prop.select!) {
          return prop.select.options;
        }
        return [];
      })
      .flatten()
      .value();

    this.logger.debug(
      `Creating tags from Notion database: ${JSON.stringify({
        databaseId: database.id,
        notionTags,
      })}`
    );

    return Promise.all(
      notionTags.map((notionTag) =>
        this.projectService.createTag({
          color: this.colorMapping[notionTag.color!] ?? "lime",
          label: notionTag.name,
          projectId,
          source: TaskTagSource.NOTION,
          externalId: notionTag.id,
        })
      )
    );
  }
}
