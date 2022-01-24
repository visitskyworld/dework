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
import { PricePoller } from "./price.poller";
import { TokenService } from "./token.service";

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
  providers: [
    PaymentResolver,
    PaymentService,
    PaymentPoller,
    PricePoller,
    TokenService,
  ],
  controllers: [PricePoller],
  exports: [PaymentService, TokenService],
})
export class PaymentModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes(PaymentPoller);
  }
}
