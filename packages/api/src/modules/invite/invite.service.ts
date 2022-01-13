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

  public async delete(
    partial: Pick<Invite, "projectId" | "projectRole">
  ): Promise<void> {
    await this.inviteRepo.delete(partial);
  }

  public async accept(inviteId: string, user: User): Promise<Invite> {
    const invite = await this.inviteRepo.findOne(inviteId);
    if (!invite) throw new NotFoundException();

    if (!!invite.organizationId && !!invite.organizationRole) {
      await this.organizationService.upsertMember({
        organizationId: invite.organizationId,
        role: invite.organizationRole,
        userId: user.id,
      });
    }

    if (!!invite.projectId && !!invite.projectRole) {
      console.warn("dangers... 1");
      const project = (await invite.project) as Project;
      await this.assertUserPassesTokenGates(project, user);

      await this.projectService.upsertMember({
        projectId: invite.projectId,
        userId: user.id,
        role: invite.projectRole,
      });

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

  private async assertUserPassesTokenGates(
    project: Project,
    user: User
  ): Promise<void> {
    const gates = await project.tokenGates;
    if (!gates.length) return;
    const tokens = await Promise.all(gates.map((g) => g.token));

    const balances = await Promise.all(
      tokens.map((t) => this.tokenService.balanceOf(t, user))
    );

    const hasAnyBalance = balances.some((b) => b.gt(0));
    if (!hasAnyBalance) {
      throw new ForbiddenException({
        reason: "MISSING_TOKENS",
        tokenIds: tokens.map((t) => t.id),
      });
    }
  }

  public async findById(id: string): Promise<Invite | undefined> {
    return this.inviteRepo.findOne(id);
  }
}
