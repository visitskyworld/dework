import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { GQLContext } from "../app/gql.config";
import { Roles } from "../app/app.roles";

@Injectable()
export class OrganizationRolesGuard implements CanActivate {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext =
      GqlExecutionContext.create(context).getContext<GQLContext>();
    if (!gqlContext.user || !gqlContext.caslUser) {
      throw new UnauthorizedException();
    }

    const organizationId = [
      gqlContext.req.body?.variables?.organizationId,
      gqlContext.req.body?.variables?.input?.organizationId,
      gqlContext.req.body?.variables?.input?.id,
    ].find((id) => !!id);

    if (!organizationId) return true;

    const organizations = await gqlContext.user.organizations;
    if (organizations.some((o) => o.id === organizationId)) {
      gqlContext.caslUser.roles.push(Roles.organizationAdmin);
    }

    return true;
  }
}
