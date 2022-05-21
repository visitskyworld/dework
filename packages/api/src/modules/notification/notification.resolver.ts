import { Notification } from "@dewo/api/models/Notification";
import { User } from "@dewo/api/models/User";
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UseGuards,
} from "@nestjs/common";
import {
  Args,
  Context,
  GraphQLISODateTime,
  Int,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import GraphQLUUID from "graphql-type-uuid";
import { AuthGuard } from "../auth/guards/auth.guard";
import { NotificationService } from "./notification.service";

@Injectable()
export class NotificationResolver {
  constructor(private readonly service: NotificationService) {}

  @Mutation(() => Notification)
  @UseGuards(AuthGuard)
  public async archiveNotification(
    @Context("user") user: User,
    @Args("id", { type: () => GraphQLUUID }) id: string
  ) {
    const notification = await this.service.findById(id);
    if (!notification) throw new NotFoundException();
    if (notification.userId !== user.id) throw new ForbiddenException();
    return this.service.archive(notification);
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard)
  public async markNotificationsRead(
    @Context("user") user: User,
    @Args("readAt", { type: () => GraphQLISODateTime }) readAt: Date
  ) {
    await this.service.markRead(user.id, readAt);
    return user;
  }
}

@Resolver(() => User)
@Injectable()
export class UserNotificationResolver {
  constructor(private readonly service: NotificationService) {}

  @ResolveField(() => [Notification])
  public async notifications(
    @Parent() parent: User,
    @Context("user") user?: User
  ) {
    if (parent.id !== user?.id) throw new ForbiddenException();
    return this.service.getNotifications(parent.id);
  }

  @ResolveField(() => Int)
  public async notificationUnreadCount(
    @Parent() parent: User,
    @Context("user") user?: User
  ) {
    if (parent.id !== user?.id) throw new ForbiddenException();
    return this.service.getNotificationUnreadCount(parent.id);
  }
}
