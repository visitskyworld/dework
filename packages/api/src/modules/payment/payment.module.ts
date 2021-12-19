import { Payment } from "@dewo/api/models/Payment";
import { PaymentMethod } from "@dewo/api/models/PaymentMethod";
import { User } from "@dewo/api/models/User";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentResolver } from "./payment.resolver";
import { PaymentService } from "./payment.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, Payment, PaymentMethod])],
  providers: [PaymentResolver, PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
