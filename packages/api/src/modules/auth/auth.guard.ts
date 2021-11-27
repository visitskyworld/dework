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
import { GQLContext } from "../app/gql.config";
import { User } from "@dewo/api/models/User";

@Injectable()
export class RequireGraphQLAuthGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext =
      GqlExecutionContext.create(context).getContext<GQLContext>();
    if (!!gqlContext.user) return true;

    const authToken = this.getAuthToken(gqlContext);
    if (!authToken) {
      throw new UnauthorizedException("Missing auth token");
    }

    const parsed = await this.jwtService.verifyAsync(authToken).catch(() => {
      throw new UnauthorizedException("JWT token invalid");
    });
    const user = await this.userRepo.findOne({ id: parsed.userId });
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    gqlContext.user = user;
    return true;
  }

  private getAuthToken(gqlContext: GQLContext): string | undefined {
    const authorization = gqlContext.req.headers.authorization;
    const match = authorization?.match(/^Bearer (.*)$/);
    return match?.[1];
  }
}

@Injectable()
export class GraphQLAuthGuard
  extends RequireGraphQLAuthGuard
  implements CanActivate
{
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      await super.canActivate(context);
    } catch {}
    return true;
  }
}
