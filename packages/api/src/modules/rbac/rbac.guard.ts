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

// export function createMixin<T extends Type<CanActivate>>(
//   mixinType: T,
//   isOptional?: boolean
// ): T {
//   @Injectable()
//   class MixinCanActivate implements CanActivate {
//     constructor(private readonly moduleRef: ModuleRef) {}

//     public canActivate = async (context: ExecutionContext): Promise<boolean> => {
//       const authContext = GqlExecutionContext.create(context).getContext<
//         AuthorizedContext
//       >();
//       if (UserRoleUtils.canAccessAnyChannel(authContext.user.role)) {
//         return true;
//       }
//       const channelIdLocator = this.moduleRef.get(locatorType, { strict: false });
//       const channelId = await channelIdLocator.get(authContext);
//       if (_.isNil(channelId)) {
//         return isOptional === true;
//       }

//       if (UserRole.INTERNAL_TOOL === authContext.user.role) {
//         return true;
//       }
//       const channelIds = authContext.channelMemberships.map(
//         (cm: ChannelMembershipAuthMetadata) => cm.channelId
//       );
//       authContext.channelGuard = { inputChannelIds: [channelId] };
//       return channelIds.includes(channelId);
//     };
//   }
//   return mixin(MixinCanActivate);
// }

export function createRoleGuard<T = any>({
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
  class RoleGuard implements CanActivate {
    constructor(
      private readonly moduleRef: ModuleRef,
      private readonly service: RbacService
    ) {} // private moduleRef: ModuleRef, // private readonly accessService: AccessService, // private reflector: Reflector,

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
      // get roles (fetching)
      return ability.can(action, subject);
      // const ability = this.reflector.get<AbilityMetadata | undefined>(CASL_META_ABILITY, context.getHandler());
      // const request = await ContextProxy.create(context).getRequest();
      // const { getUserHook } = CaslConfig.getRootOptions();
      // const req = new RequestProxy(request);

      // req.setUserHook(await userHookFactory(this.moduleRef, getUserHook));
      // req.setSubjectHook(await subjectHookFactory(this.moduleRef, ability?.subjectHook));

      // return await this.accessService.canActivateAbility(request, ability);
    }
  }

  return mixin(RoleGuard);
}
