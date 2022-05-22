import { Injectable, Logger } from "@nestjs/common";
import { Task } from "@dewo/api/models/Task";
import { Project } from "@dewo/api/models/Project";
import { Organization } from "@dewo/api/models/Organization";
import { ConfigService } from "@nestjs/config";
import { ConfigType } from "../app/config";
import { User } from "@dewo/api/models/User";
import { TaskNFT } from "@dewo/api/models/TaskNFT";
import { Invite } from "@dewo/api/models/Invite";
import { TaskView } from "@dewo/api/models/TaskView";
import { Workspace } from "@dewo/api/models/Workspace";

@Injectable()
export class PermalinkService {
  constructor(private readonly config: ConfigService<ConfigType>) {}
  private logger = new Logger(this.constructor.name);

  private async getBoard(
    object: User | Project | Organization,
    appUrl: string
  ) {
    if (object instanceof User) {
      return `${await this.get(object, appUrl)}/board`;
    }
    if (object instanceof Organization) {
      return `${await this.get(object, appUrl)}/board`;
    }
    return await this.get(object, appUrl);
  }

  async get(
    object:
      | Task
      | TaskView
      | TaskNFT
      | Project
      | Workspace
      | Organization
      | User
      | Invite,
    appUrl = this.config.get("APP_URL")
  ): Promise<string> {
    if (object instanceof Invite) {
      return `${appUrl}/i/${object.slug}`;
    }
    if (object instanceof User) {
      return `${appUrl}/profile/${encodeURIComponent(object.username)}`;
    }
    if (object instanceof Task) {
      const p = await object.project;
      return `${await this.get(p, appUrl)}?taskId=${object.id}`;
    }
    if (object instanceof TaskView) {
      const p =
        (await object.project) ??
        (await object.user) ??
        (await object.organization);

      if (p) return `${await this.getBoard(p, appUrl)}/view/${object.slug}`;
    }
    if (object instanceof Project) {
      const o = await object.organization;
      return `${await this.get(o, appUrl)}/${object.slug}`;
    }
    if (object instanceof Workspace) {
      const o = await object.organization;
      return `${await this.get(o, appUrl)}/workspace/${object.slug}`;
    }
    if (object instanceof Organization) {
      return `${appUrl}/${object.slug}`;
    }
    if (object instanceof TaskNFT) {
      return `https://dwrk.xyz/${object.slug}`;
    }

    this.logger.error(
      `Unknown object type: ${(object as any)?.constructor?.name}`
    );

    return appUrl;
  }
}
