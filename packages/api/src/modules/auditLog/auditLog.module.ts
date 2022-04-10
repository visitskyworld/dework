import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuditLogEvent } from "@dewo/api/models/AuditLogEvent";
import { AuditLogService } from "./auditLog.service";
import {
  AuditLogTaskCreatedEventHandler,
  AuditLogTaskUpdatedEventHandler,
} from "./auditLog.eventHandlers";

@Module({
  imports: [TypeOrmModule.forFeature([AuditLogEvent])],
  providers: [
    AuditLogService,
    AuditLogTaskCreatedEventHandler,
    AuditLogTaskUpdatedEventHandler,
  ],
  exports: [AuditLogService],
})
export class AuditLogModule {}
