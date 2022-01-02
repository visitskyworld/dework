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
import { Project } from "@dewo/api/models/Project";
import { Roles } from "../app/app.roles";
import {
  OrganizationMember,
  OrganizationRole,
} from "@dewo/api/models/OrganizationMember";
import { ProjectMember, ProjectRole } from "@dewo/api/models/ProjectMember";

@Injectable()
export class ProjectRolesGuard implements CanActivate {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
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

    const projectId = [
      gqlContext.req.body?.variables?.projectId,
      gqlContext.req.body?.variables?.input?.projectId,
      gqlContext.req.body?.variables?.input?.id,
    ].find((id) => !!id);

    if (!projectId) {
      return true;
    }

    const project = await this.projectRepo.findOne(projectId);
    if (!project) {
      throw new ForbiddenException("Project not found");
    }

    await this.addCaslRolesForOrganization(project.organizationId, gqlContext);
    await this.addCaslRolesForProject(projectId, gqlContext);
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

    if (member?.role === ProjectRole.MEMBER) {
      gqlContext.caslUser.roles.push(Roles.projectMember);
    }
  }
}
