import { Payment } from "@dewo/api/models/Payment";
import { PaymentMethod } from "@dewo/api/models/PaymentMethod";
import { PaymentNetwork } from "@dewo/api/models/PaymentNetwork";
import { PaymentToken } from "@dewo/api/models/PaymentToken";
import { User } from "@dewo/api/models/User";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LoggerMiddleware } from "../auth/logger";
import { PaymentPoller } from "./payment.poller";
import { PaymentResolver } from "./payment.resolver";
import { PaymentService } from "./payment.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Payment,
      PaymentMethod,
      PaymentNetwork,
      PaymentToken,
    ]),
  ],
  providers: [PaymentResolver, PaymentService, PaymentPoller],
  controllers: [PaymentPoller],
  exports: [PaymentService],
})
export class PaymentModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes(PaymentPoller);
  }
}
