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
import { GQLContext } from "../app/gql.config";
import { Task } from "@dewo/api/models/Task";
import { Roles } from "../app/app.roles";

@Injectable()
export class TaskRolesGuard implements CanActivate {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>
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
    ].find((id) => !!id);

    if (!taskId) {
      throw new ForbiddenException("Could not find taskId in variables");
    }

    const task = await this.taskRepo.findOne(taskId);
    if (!task) throw new ForbiddenException("Task not found");

    const project = await task.project;
    if (!project) throw new ForbiddenException("Project not found");

    const organizations = await gqlContext.user.organizations;
    if (organizations.some((o) => o.id === project.organizationId)) {
      gqlContext.caslUser.roles.push(Roles.projectAdmin);
      gqlContext.caslUser.roles.push(Roles.projectMember);
    }

    return true;
  }
}
