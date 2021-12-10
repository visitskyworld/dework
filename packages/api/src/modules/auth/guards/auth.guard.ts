import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { GQLContext } from "../../app/graphql.config";

@Injectable()
export class AuthGuard implements CanActivate {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext =
      GqlExecutionContext.create(context).getContext<GQLContext>();
    if (!gqlContext.user) throw new UnauthorizedException();
    return true;
  }
}
