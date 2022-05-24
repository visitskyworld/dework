import { Invite } from "@dewo/api/models/Invite";
import { RulePermission } from "@dewo/api/models/enums/RulePermission";
import { User } from "@dewo/api/models/User";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { RbacService } from "../rbac/rbac.service";
import { TaskService } from "../task/task.service";

@Injectable()
export class InviteService {
  constructor(
    @InjectRepository(Invite)
    private readonly inviteRepo: Repository<Invite>,
    private readonly rbacService: RbacService,
    private readonly taskService: TaskService
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
    partial: Pick<Invite, "projectId" | "permission">
  ): Promise<void> {
    await this.inviteRepo.delete(partial);
  }

  public async accept(inviteId: string, user: User): Promise<Invite> {
    const invite = await this.inviteRepo.findOne(inviteId);
    if (!invite) throw new NotFoundException();

    const permissions = this.getRulesByInvitePermission(invite.permission);
    if (!!permissions) {
      const [task, project] = await Promise.all([invite.task, invite.project]);
      const organizationId =
        invite.organizationId ??
        project?.organizationId ??
        (await task?.project)?.organizationId;
      const projectId = project?.id ?? task?.projectId;
      if (!organizationId) throw new NotFoundException();

      const fallbackRole = await this.rbacService.getFallbackRole(
        organizationId
      );

      if (!!fallbackRole) {
        await this.rbacService.addRoles(user.id, [fallbackRole.id]);
      }

      const role = await this.rbacService.getOrCreatePersonalRole(
        user.id,
        organizationId
      );

      if (!!invite.organizationId) {
        await this.rbacService.createRules(
          permissions.map((permission) => ({ roleId: role.id, permission }))
        );
      }

      if (!!projectId) {
        await this.rbacService.createRules(
          permissions.map((permission) => ({
            roleId: role.id,
            permission,
            projectId,
          }))
        );
      }

      if (!!invite.taskId) {
        await this.taskService.update({ id: invite.taskId, assignees: [user] });
      }
    }

    return invite;
  }

  public getRulesByInvitePermission(
    permission: RulePermission
  ): RulePermission[] | undefined {
    switch (permission) {
      case RulePermission.MANAGE_ORGANIZATION:
        return [
          RulePermission.MANAGE_ORGANIZATION,
          RulePermission.MANAGE_PROJECTS,
        ];
      case RulePermission.MANAGE_PROJECTS:
        return [RulePermission.MANAGE_PROJECTS, RulePermission.VIEW_PROJECTS];
      case RulePermission.MANAGE_TASKS:
        return [RulePermission.MANAGE_TASKS, RulePermission.VIEW_PROJECTS];
      case RulePermission.VIEW_PROJECTS:
        return [RulePermission.VIEW_PROJECTS];
      default:
        return undefined;
    }
  }

  public async findById(id: string): Promise<Invite | undefined> {
    return this.inviteRepo.findOne(id);
  }
}
