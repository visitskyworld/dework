import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
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
import { ProjectMember, ProjectRole } from "@dewo/api/models/ProjectMember";

@Injectable()
export class TaskRolesGuard implements CanActivate {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    @InjectRepository(OrganizationMember)
    private readonly organizationMemberRepo: Repository<OrganizationMember>,
    @InjectRepository(ProjectMember)
    private readonly projectMemberRepo: Repository<ProjectMember>
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext =
      GqlExecutionContext.create(context).getContext<GQLContext>();
    if (!gqlContext.user || !gqlContext.caslUser) {
      return true;
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

    await this.addCaslRolesForOrganization(project.organizationId, gqlContext);
    await this.addCaslRolesForProject(project.id, gqlContext);
    return true;
  }

  // TODO(fant): DRY this up with OrganizationRolesGuard
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
  }

  // TODO(fant): DRY this up with ProjectRolesGuard
  public async addCaslRolesForProject(
    projectId: string,
    gqlContext: GQLContext
  ): Promise<void> {
    if (!gqlContext.user || !gqlContext.caslUser) return;

    const member = await this.projectMemberRepo.findOne({
      projectId,
      userId: gqlContext.user.id,
    });

    if (member?.role === ProjectRole.ADMIN) {
      gqlContext.caslUser.roles.push(Roles.projectAdmin);
    }

    if (member?.role === ProjectRole.CONTRIBUTOR) {
      gqlContext.caslUser.roles.push(Roles.projectContributor);
    }
  }
}
