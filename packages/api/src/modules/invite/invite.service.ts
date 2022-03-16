import { Invite } from "@dewo/api/models/Invite";
import { OrganizationRole } from "@dewo/api/models/OrganizationMember";
import { Project } from "@dewo/api/models/Project";
import { RulePermission } from "@dewo/api/models/rbac/Rule";
import { User } from "@dewo/api/models/User";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { OrganizationService } from "../organization/organization.service";
import { ProjectService } from "../project/project.service";
import { RbacService } from "../rbac/rbac.service";

@Injectable()
export class InviteService {
  constructor(
    @InjectRepository(Invite)
    private readonly inviteRepo: Repository<Invite>,
    private readonly organizationService: OrganizationService,
    private readonly projectService: ProjectService,
    private readonly rbacService: RbacService
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

    if (!!invite.organizationId) {
      const organization = await invite.organization;
      const roles = await organization?.roles;
      const fallbackRole = roles?.find((r) => r.fallback);

      const role = await this.rbacService.getOrCreatePersonalRole(
        user.id,
        invite.organizationId
      );

      if (!!fallbackRole) {
        await this.rbacService.addRole(user.id, fallbackRole.id);
      }
      await this.rbacService.createRules(
        [
          RulePermission.MANAGE_ORGANIZATION,
          RulePermission.MANAGE_PROJECTS,
          RulePermission.MANAGE_TASKS,
        ].map((permission) => ({ roleId: role.id, permission }))
      );
    }

    if (!!invite.projectId && !!invite.projectRole) {
      const project = (await invite.project) as Project;
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

  public async findById(id: string): Promise<Invite | undefined> {
    return this.inviteRepo.findOne(id);
  }
}
