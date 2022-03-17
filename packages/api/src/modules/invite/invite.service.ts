import { ProjectRole } from "@dewo/api/models/enums/ProjectRole";
import { Invite } from "@dewo/api/models/Invite";
import { Organization } from "@dewo/api/models/Organization";
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
      const organization = (await invite.organization) as Organization;
      const roles = await organization.roles;
      const fallbackRole = roles.find((r) => r.fallback);

      if (!!fallbackRole) {
        await this.rbacService.addRole(user.id, fallbackRole.id);
      }

      const role = await this.rbacService.getOrCreatePersonalRole(
        user.id,
        organization.id
      );
      await this.rbacService.createRules(
        [
          RulePermission.MANAGE_ORGANIZATION,
          RulePermission.MANAGE_PROJECTS,
        ].map((permission) => ({ roleId: role.id, permission }))
      );
    }

    if (!!invite.projectId && !!invite.projectRole) {
      const project = (await invite.project) as Project;
      const organization = await project.organization;
      const roles = await organization.roles;
      const fallbackRole = roles.find((r) => r.fallback);

      if (!!fallbackRole) {
        await this.rbacService.addRole(user.id, fallbackRole.id);
      }

      const role = await this.rbacService.getOrCreatePersonalRole(
        user.id,
        organization.id
      );
      if (invite.projectRole === ProjectRole.ADMIN) {
        await this.rbacService.createRules(
          [
            RulePermission.MANAGE_ORGANIZATION,
            RulePermission.MANAGE_PROJECTS,
            RulePermission.VIEW_PROJECTS,
            RulePermission.SUGGEST_AND_VOTE,
          ].map((permission) => ({
            roleId: role.id,
            permission,
            projectId: project.id,
          }))
        );
      } else if (invite.projectRole === ProjectRole.CONTRIBUTOR) {
        await this.rbacService.createRules(
          [RulePermission.VIEW_PROJECTS, RulePermission.SUGGEST_AND_VOTE].map(
            (permission) => ({
              roleId: role.id,
              permission,
              projectId: project.id,
            })
          )
        );
      }
    }

    return invite;
  }

  public async findById(id: string): Promise<Invite | undefined> {
    return this.inviteRepo.findOne(id);
  }
}
