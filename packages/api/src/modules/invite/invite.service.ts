import { Invite } from "@dewo/api/models/Invite";
import { OrganizationRole } from "@dewo/api/models/OrganizationMember";
import { Project } from "@dewo/api/models/Project";
import { User } from "@dewo/api/models/User";
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { OrganizationService } from "../organization/organization.service";
import { TokenService } from "../payment/token.service";
import { ProjectService } from "../project/project.service";

@Injectable()
export class InviteService {
  constructor(
    @InjectRepository(Invite)
    private readonly inviteRepo: Repository<Invite>,
    private readonly organizationService: OrganizationService,
    private readonly projectService: ProjectService,
    private readonly tokenService: TokenService
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

    if (!!invite.tokenId) {
      const token = await invite.token;
      const balanceOf = await this.tokenService.balanceOf(token!, user);
      if (!balanceOf) {
        throw new ForbiddenException({
          reason: "MISSING_TOKEN",
          tokenId: invite.tokenId,
        });
      }
    }

    if (!!invite.organizationId && !!invite.organizationRole) {
      await this.organizationService.upsertMember({
        organizationId: invite.organizationId,
        role: invite.organizationRole,
        userId: user.id,
      });
    }

    if (!!invite.projectId && !!invite.projectRole) {
      await this.projectService.upsertMember({
        projectId: invite.projectId,
        userId: user.id,
        role: invite.projectRole,
      });

      const project = (await invite.project) as Project;
      const organizationMember = await this.organizationService.findMember({
        userId: user.id,
        organizationId: project.organizationId,
      });
      if (!organizationMember) {
        await this.organizationService.upsertMember({
          organizationId: project.organizationId,
          role: OrganizationRole.FOLLOWER,
          userId: user.id,
        });
      }
    }

    return invite;
  }

  public async findById(id: string): Promise<Invite | undefined> {
    return this.inviteRepo.findOne(id);
  }
}
