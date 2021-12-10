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
import { Project } from "@dewo/api/models/Project";
import { Roles } from "../app/app.roles";
import { OrganizationService } from "../organization/organization.service";

@Injectable()
export class ProjectRolesGuard implements CanActivate {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    private readonly organizationService: OrganizationService
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext =
      GqlExecutionContext.create(context).getContext<GQLContext>();
    if (!gqlContext.user || !gqlContext.caslUser) {
      throw new UnauthorizedException();
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

    const organizations = await this.organizationService.findByUser(
      gqlContext.user.id
    );
    if (organizations.some((o) => o.id === project.organizationId)) {
      gqlContext.caslUser.roles.push(Roles.projectAdmin);
      gqlContext.caslUser.roles.push(Roles.projectMember);
    }

    return true;
  }
}
