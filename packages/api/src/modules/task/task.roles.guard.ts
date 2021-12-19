import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GQLContext } from "../app/graphql.config";
import { Task } from "@dewo/api/models/Task";
import { Roles } from "../app/app.roles";
import {
  OrganizationMember,
  OrganizationRole,
} from "@dewo/api/models/OrganizationMember";

@Injectable()
export class TaskRolesGuard implements CanActivate {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    @InjectRepository(OrganizationMember)
    private readonly organizationMemberRepo: Repository<OrganizationMember>
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext =
      GqlExecutionContext.create(context).getContext<GQLContext>();
    if (!gqlContext.user || !gqlContext.caslUser) {
      throw new UnauthorizedException();
    }

    const taskId = [
      gqlContext.req.body?.variables?.taskId,
      gqlContext.req.body?.variables?.input?.id,
      gqlContext.req.body?.variables?.input?.taskId,
    ].find((id) => !!id);

    if (!taskId) {
      return true;
    }

    const task = await this.taskRepo.findOne(taskId);
    if (!task) throw new ForbiddenException("Task not found");

    const project = await task.project;
    if (!project) throw new ForbiddenException("Project not found");

    // TODO(fant): DRY this up with OrganizationRolesGuard
    await this.addCaslRolesForOrganization(project.organizationId, gqlContext);
    return true;
  }

  public async addCaslRolesForOrganization(
    organizationId: string,
    gqlContext: GQLContext
  ): Promise<void> {
    if (!gqlContext.user || !gqlContext.caslUser) return;

    const member = await this.organizationMemberRepo.findOne({
      organizationId,
      userId: gqlContext.user.id,
    });

    if (member?.role === OrganizationRole.OWNER) {
      gqlContext.caslUser.roles.push(Roles.organizationOwner);
    }

    if (member?.role === OrganizationRole.ADMIN) {
      gqlContext.caslUser.roles.push(Roles.organizationAdmin);
    }

    if (member?.role === OrganizationRole.MEMBER) {
      gqlContext.caslUser.roles.push(Roles.organizationMember);
    }
  }
}
