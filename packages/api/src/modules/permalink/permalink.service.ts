import { Injectable, Logger } from "@nestjs/common";
import { Task } from "@dewo/api/models/Task";
import { Project } from "@dewo/api/models/Project";
import { Organization } from "@dewo/api/models/Organization";
import { ConfigService } from "@nestjs/config";
import { ConfigType } from "../app/config";
import { User } from "@dewo/api/models/User";
import { TaskNFT } from "@dewo/api/models/TaskNFT";
import { Invite } from "@dewo/api/models/Invite";

@Injectable()
export class PermalinkService {
  constructor(private readonly config: ConfigService<ConfigType>) {}
  private logger = new Logger(this.constructor.name);

  async get(
    object: Task | TaskNFT | Project | Organization | User | Invite,
    appUrl = this.config.get("APP_URL")
  ): Promise<string> {
    if (object instanceof Invite) {
      return `${appUrl}/i/${object.slug}`;
    }
    if (object instanceof User) {
      return `${appUrl}/profile/${object.id}`;
    }
    if (object instanceof Task) {
      const p = await object.project;
      return `${await this.get(p, appUrl)}?taskId=${object.id}`;
    }
    if (object instanceof Project) {
      const o = await object.organization;
      return `${await this.get(o, appUrl)}/p/${object.slug}`;
    }
    if (object instanceof Organization) {
      return `${appUrl}/o/${object.slug}`;
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
