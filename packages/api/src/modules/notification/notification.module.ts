import { Notification } from "@dewo/api/models/Notification";
import { NotificationReadMarker } from "@dewo/api/models/NotificationReadMarker";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationTaskUpdatedEventHandler } from "./notification.eventHandlers";
import {
  NotificationResolver,
  UserNotificationResolver,
} from "./notification.resolver";
import { NotificationService } from "./notification.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, NotificationReadMarker]),
    CqrsModule,
  ],
  providers: [
    NotificationService,
    NotificationResolver,
    UserNotificationResolver,
    NotificationTaskUpdatedEventHandler,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
