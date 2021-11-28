import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { GQLContext } from "../../app/gql.config";

@Injectable()
export class OrganizationMemberGuard implements CanActivate {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext =
      GqlExecutionContext.create(context).getContext<GQLContext>();
    if (!gqlContext.user) throw new UnauthorizedException();

    const organizationId = [
      gqlContext.req.body?.variables?.organizationId,
      gqlContext.req.body?.variables?.input?.organizationId,
    ].find((id) => !!id);

    if (!organizationId) {
      throw new UnauthorizedException(
        "Could not find organizationId in variables"
      );
    }

    const organizations = await gqlContext.user.organizations;
    if (!organizations.some((o) => o.id === organizationId)) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
