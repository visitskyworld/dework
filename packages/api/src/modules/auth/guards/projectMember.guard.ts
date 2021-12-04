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
import { GQLContext } from "../../app/gql.config";
import { Project } from "@dewo/api/models/Project";

@Injectable()
export class ProjectMemberGuard implements CanActivate {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext =
      GqlExecutionContext.create(context).getContext<GQLContext>();
    if (!gqlContext.user) throw new UnauthorizedException();

    const projectId = [
      gqlContext.req.body?.variables?.projectId,
      gqlContext.req.body?.variables?.input?.id,
      gqlContext.req.body?.variables?.input?.projectId,
    ].find((id) => !!id);

    if (!projectId) {
      throw new ForbiddenException("Could not find projectId in variables");
    }

    const project = await this.projectRepo.findOne(projectId);
    if (!project) {
      throw new ForbiddenException("Project not found");
    }

    const organizations = await gqlContext.user.organizations;
    if (!organizations.some((o) => o.id === project.organizationId)) {
      throw new ForbiddenException();
    }

    return true;
  }
}
