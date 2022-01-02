import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { GQLContext } from "../app/graphql.config";
import { Roles } from "../app/app.roles";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  OrganizationMember,
  OrganizationRole,
} from "@dewo/api/models/OrganizationMember";

@Injectable()
export class OrganizationRolesGuard implements CanActivate {
  constructor(
    @InjectRepository(OrganizationMember)
    private readonly organizationMemberRepo: Repository<OrganizationMember>
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext =
      GqlExecutionContext.create(context).getContext<GQLContext>();
    if (!gqlContext.user || !gqlContext.caslUser) {
      return true;
    }

    const organizationId = [
      gqlContext.req.body?.variables?.organizationId,
      gqlContext.req.body?.variables?.input?.organizationId,
      gqlContext.req.body?.variables?.input?.id,
    ].find((id) => !!id);

    if (!organizationId) return true;
    await this.addCaslRolesForOrganization(organizationId, gqlContext);

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
