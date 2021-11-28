import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import { GQLContext } from "../../app/gql.config";
import { User } from "@dewo/api/models/User";
import { Organization } from "@dewo/api/models/Organization";

@Injectable()
export class OrganizationMemberGuard implements CanActivate {
  constructor() {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext =
      GqlExecutionContext.create(context).getContext<GQLContext>();
    if (!gqlContext.user) throw new UnauthorizedException();

    const organizationId = [
      gqlContext.req.body?.variables?.organizationId,
      gqlContext.req.body?.variables?.input?.organizationId,
    ].find((i) => !!i);

    if (!organizationId) throw new UnauthorizedException();

    const organizations = await gqlContext.user.organizations;
    if (!organizations.some((o) => o.id === organizationId)) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
