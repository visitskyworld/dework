import { AnyClass } from "@casl/ability/dist/types/types";
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

type InferClass<T> = T extends AnyClass<infer I> ? I : never;

export function RoleGuard<
  TParams extends object,
  TSubject extends Subject,
  TInject extends any[]
>({
  action,
  inject,
  subject,
  getSubject,
  getOrganizationId,
}: {
  action: Action;
  inject?: TInject;
  subject: TSubject;
  getSubject?(
    params: TParams,
    ...args: InferClass<TInject[number]>[]
  ):
    | Promise<InferClass<TSubject> | undefined>
    | InferClass<TSubject>
    | undefined;
  getOrganizationId(
    subject: InferClass<TSubject>,
    params: TParams,
    ...args: InferClass<TInject[number]>[]
  ): Promise<string | undefined> | string | undefined;
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
      const params = ctx.getArgs();
      const injectable = inject?.map((i) => this.moduleRef.get(i)) ?? [];

      const actualSubject =
        (await getSubject?.(params, ...injectable)) ?? subject;

      if (!actualSubject) {
        throw new ForbiddenException();
      }

      const organizationId = await getOrganizationId(
        actualSubject as InferClass<TSubject>,
        params,
        ...injectable
      );
      if (!organizationId) {
        throw new ForbiddenException();
      }

      const ability = await this.service.abilityForUser(
        gqlContext.user?.id,
        organizationId
      );
      return ability.can(action, actualSubject);
    }
  }

  return mixin(RoleGuardMixin);
}
