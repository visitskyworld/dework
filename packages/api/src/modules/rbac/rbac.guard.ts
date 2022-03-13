import {
  CanActivate,
  Injectable,
  ExecutionContext,
  Type,
  mixin,
  ForbiddenException,
} from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { GQLContext } from "../app/graphql.config";
import { Action, Subject, RbacService } from "./rbac.service";

export function RoleGuard({
  action,
  subject,
  inject,
  getOrganizationId,
}: {
  action: Action;
  subject: Subject;
  inject?: any[];
  getOrganizationId(...args: any[]): Promise<string | undefined>;
}): Type<CanActivate> {
  @Injectable()
  class RoleGuardMixin implements CanActivate {
    constructor(
      private readonly moduleRef: ModuleRef,
      private readonly service: RbacService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const ctx = GqlExecutionContext.create(context);
      const gqlContext = ctx.getContext<GQLContext>();
      const injectable = inject?.map((i) => this.moduleRef.get(i)) ?? [];
      const organizationId = await getOrganizationId(
        ...injectable,
        ctx.getArgs()
      );
      if (!organizationId) {
        throw new ForbiddenException();
      }

      const ability = await this.service.abilityForUser(
        gqlContext.user?.id,
        organizationId
      );
      return ability.can(action, subject);
    }
  }

  return mixin(RoleGuardMixin);
}
