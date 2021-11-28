import {
  CanActivate,
  ExecutionContext,
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
      gqlContext.req.body?.variables?.input?.projectId,
    ].find((id) => !!id);

    if (!projectId) {
      throw new UnauthorizedException("Could not find projectId in variables");
    }

    const project = await this.projectRepo.findOne(projectId);
    if (!project) {
      throw new UnauthorizedException("Project not found");
    }

    const organizations = await gqlContext.user.organizations;
    if (!organizations.some((o) => o.id === project.organizationId)) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
