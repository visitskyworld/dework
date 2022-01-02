import { Invite } from "@dewo/api/models/Invite";
import { User } from "@dewo/api/models/User";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { OrganizationService } from "../organization/organization.service";
import { ProjectService } from "../project/project.service";

@Injectable()
export class InviteService {
  // private readonly logger = new Logger("UserService");

  constructor(
    @InjectRepository(Invite)
    private readonly inviteRepo: Repository<Invite>,
    private readonly organizationService: OrganizationService,
    private readonly projectService: ProjectService
  ) {}

  public async create(
    partial: DeepPartial<Invite>,
    user: User
  ): Promise<Invite> {
    const created = await this.inviteRepo.save({
      ...partial,
      inviterId: user.id,
    });
    return this.findById(created.id) as Promise<Invite>;
  }

  public async accept(inviteId: string, user: User): Promise<Invite> {
    const invite = await this.inviteRepo.findOne(inviteId);
    if (!invite) throw new NotFoundException();

    if (!!invite.organizationId && !!invite.organizationRole) {
      await this.organizationService.upsertMember(
        invite.organizationId,
        user.id,
        invite.organizationRole
      );
    }

    if (!!invite.projectId && !!invite.projectRole) {
      await this.projectService.upsertMember({
        projectId: invite.projectId,
        userId: user.id,
        role: invite.projectRole,
      });
    }

    return invite;
  }

  public async findById(id: string): Promise<Invite | undefined> {
    return this.inviteRepo.findOne(id);
  }
}
