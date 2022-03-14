import { AnyClass } from "@casl/ability/dist/types/types";
import {
  CanActivate,
  Injectable,
  ExecutionContext,
  Type,
  mixin,
  ForbiddenException,
  Logger,
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
  fields,
  getSubject,
  getFields,
  getOrganizationId,
}: {
  action: Action;
  subject: TSubject;
  fields?: string[];
  inject?: TInject;
  getSubject?(
    params: TParams,
    ...args: InferClass<TInject[number]>[]
  ):
    | Promise<InferClass<TSubject> | undefined>
    | InferClass<TSubject>
    | undefined;
  getFields?(params: TParams): string[];
  getOrganizationId(
    subject: InferClass<TSubject>,
    params: TParams,
    ...args: InferClass<TInject[number]>[]
  ): Promise<string | undefined> | string | undefined;
}): Type<CanActivate> {
  @Injectable()
  class RoleGuardMixin implements CanActivate {
    private logger = new Logger(this.constructor.name);

    constructor(
      private readonly moduleRef: ModuleRef,
      private readonly service: RbacService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const ctx = GqlExecutionContext.create(context);
      const gqlContext = ctx.getContext<GQLContext>();
      const params = ctx.getArgs();

      this.logger.debug("Running guard");

      const injectable =
        inject?.map((i) => this.moduleRef.get(i, { strict: false })) ?? [];
      this.logger.debug("Got services to inject");

      const actualSubject =
        (await getSubject?.(params, ...injectable)) ?? subject;
      const actualFields = (await getFields?.(params)) ?? fields ?? [undefined];

      this.logger.debug(
        `Resolved subject and field(s): ${JSON.stringify({
          actualSubject,
          actualFields,
        })}`
      );

      if (!actualSubject) {
        throw new ForbiddenException("Subject not found");
      }

      const organizationId = await getOrganizationId(
        actualSubject as InferClass<TSubject>,
        params,
        ...injectable
      );
      this.logger.debug(`Fetched organization id: ${organizationId}`);
      if (!organizationId) {
        throw new ForbiddenException("Organization not found");
      }

      const ability = await this.service.abilityForUser(
        gqlContext.user?.id,
        organizationId
      );
      const granted = actualFields?.map((field) =>
        ability.can(action, actualSubject, field)
      );
      this.logger.debug(
        `Has access: ${JSON.stringify({
          action,
          granted,
          fields: actualFields,
        })}`
      );
      return granted.every(Boolean);
    }
  }

  return mixin(RoleGuardMixin);
}
