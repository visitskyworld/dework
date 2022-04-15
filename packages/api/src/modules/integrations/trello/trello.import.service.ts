import { TaskStatus } from "@dewo/api/models/Task";
import { TaskTag, TaskTagSource } from "@dewo/api/models/TaskTag";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import Trello from "trello-node-api";

import * as AntColors from "@ant-design/colors";
import { ProjectService } from "../../project/project.service";
import { User } from "@dewo/api/models/User";
import { TaskService } from "../../task/task.service";
import { ConfigService } from "@nestjs/config";
import { ConfigType } from "../../app/config";
import { TrelloAPI } from "./types";
import { ThreepidService } from "../../threepid/threepid.service";
import {
  ThreepidSource,
  TrelloThreepidConfig,
} from "@dewo/api/models/Threepid";
import { TrelloBoard } from "./dto/TrelloBoard";
import { RbacService } from "../../rbac/rbac.service";
import { RulePermission } from "@dewo/api/models/rbac/Rule";
import { statusMappingGuesses } from "@dewo/api/utils/statusMappingGuesses";

@Injectable()
export class TrelloImportService {
  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly projectService: ProjectService,
    private readonly taskService: TaskService,
    private readonly threepidService: ThreepidService,
    private readonly rbacService: RbacService,
    private readonly config: ConfigService<ConfigType>
  ) {}

  private colorMapping: Record<string, keyof typeof AntColors> = {
    green: "green",
    yellow: "gold",
    orange: "orange",
    red: "red",
    purple: "purple",
    blue: "blue",
    sky: "cyan",
    lime: "lime",
    pink: "magenta",
    black: "grey",
  };

  public async getBoards(threepidId: string): Promise<TrelloBoard[]> {
    const trello = await this.createClient(threepidId);
    const boards = await trello.member.searchBoards("me");
    return boards.map((board: any) => ({ id: board.id, name: board.name }));
  }

  public async createProjectsFromBoards(
    organizationId: string,
    threepidId: string,
    boardIds: string[],
    user: User
  ) {
    this.logger.log(
      `Starting Trello import: ${JSON.stringify({
        boardIds,
        organizationId,
        userId: user.id,
      })}`
    );
    const trello = await this.createClient(threepidId);
    const fallbackRole = await this.rbacService.getFallbackRole(organizationId);
    const personalRole = await this.rbacService.getOrCreatePersonalRole(
      user.id,
      organizationId
    );
    if (!fallbackRole) throw new Error("Organization is missing fallback role");

    for (const boardId of boardIds) {
      this.logger.debug(`Import Trello board: ${JSON.stringify({ boardId })}`);

      const [board, lists, labels, cards] = await Promise.all([
        trello.board.search(boardId) as Promise<TrelloAPI.Board>,
        trello.board.searchLists(boardId) as Promise<TrelloAPI.List[]>,
        trello.board.searchLabels(boardId) as Promise<TrelloAPI.Label[]>,
        trello.board.searchCards(boardId) as Promise<TrelloAPI.Card[]>,
      ]);

      this.logger.debug(
        `Fetched Trello board: ${JSON.stringify({
          board,
          lists,
          labels,
          cards,
        })}`
      );

      const name = board.name;
      const description = board.desc;
      const isPrivate = board.prefs.permissionLevel === "private";
      const project = await this.projectService.create({
        organizationId,
        name,
        description,
      });
      if (isPrivate) {
        await this.rbacService.createRules([
          {
            roleId: fallbackRole.id,
            permission: RulePermission.VIEW_PROJECTS,
            inverted: true,
            projectId: project.id,
          },
          {
            roleId: personalRole.id,
            permission: RulePermission.VIEW_PROJECTS,
            projectId: project.id,
          },
        ]);
      }

      this.logger.debug(
        `Created project: ${JSON.stringify({
          id: project.id,
          name,
          description,
          isPrivate,
        })}`
      );

      const tags = await this.createTags(labels, project.id);

      for (const card of cards) {
        const list = lists.find((l) => l.id === card.idList);
        const status = this.guessStatus(list?.name);
        const taskTags = tags.filter((t) =>
          card.labels.some((l) => l.id === t.externalId)
        );

        this.logger.debug(
          `Creating task from Task card: ${JSON.stringify({
            boardId,
            cardId: card.id,
            status,
            tagIds: taskTags.map((t) => t.id),
          })}`
        );

        const task = await this.taskService.create({
          name: card.name,
          status: status ?? TaskStatus.TODO,
          tags: taskTags,
          dueDate: card.due,
          description: [
            card.desc,
            `Originally created from Trello card: ${card.shortUrl}`,
          ]
            .join("\n\n")
            .trim(),
          projectId: project.id,
        });

        const checklists = await trello.card.searchChecklists(card.id);
        if (!!checklists.length) {
          this.logger.debug(
            `Creating task subtasks: ${JSON.stringify({
              checklists,
            })}`
          );
          for (const checklist of checklists) {
            for (const item of checklist.checkItems) {
              await this.taskService.create({
                name: item.name,
                status:
                  item.state === "complete" ? TaskStatus.DONE : TaskStatus.TODO,
                parentTaskId: task.id,
                projectId: project.id,
              });
            }
          }
        }
      }
    }

    this.logger.log(
      `Finished Trello import: ${JSON.stringify({
        organizationId,
        userId: user.id,
      })}`
    );
  }

  private guessStatus(listName: string | undefined): TaskStatus | undefined {
    if (!listName) return undefined;
    for (const [status, guesses] of Object.entries(statusMappingGuesses)) {
      if (guesses.some((guess) => listName.toLowerCase().includes(guess))) {
        return status as TaskStatus;
      }
    }

    return undefined;
  }

  private async createTags(
    trelloLabels: TrelloAPI.Label[],
    projectId: string
  ): Promise<TaskTag[]> {
    return Promise.all(
      trelloLabels.map((trelloLabel) =>
        this.projectService.createTag({
          color: this.colorMapping[trelloLabel.color] ?? "blue",
          label: trelloLabel.name,
          projectId,
          source: TaskTagSource.TRELLO,
          externalId: trelloLabel.id,
        })
      )
    );
  }

  private async createClient(threepidId: string): Promise<Trello> {
    const threepid = await this.threepidService.findOne({
      id: threepidId,
      source: ThreepidSource.trello,
    });
    if (!threepid) throw new NotFoundException();
    return new Trello(
      this.config.get("TRELLO_API_KEY") as string,
      (threepid.config as TrelloThreepidConfig).token
    );
  }
}
