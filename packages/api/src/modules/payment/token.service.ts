import { PaymentToken } from "@dewo/api/models/PaymentToken";
import { User } from "@dewo/api/models/User";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TokenService {
  constructor() {} // private readonly paymentTokenRepo: Repository<PaymentToken> // @InjectRepository(PaymentToken) // private readonly paymentNetworkRepo: Repository<PaymentNetwork>, // @InjectRepository(PaymentNetwork) // private readonly paymentMethodRepo: Repository<PaymentMethod>, // @InjectRepository(PaymentMethod) // private readonly paymentRepo: Repository<Payment>, // @InjectRepository(Payment)

  public async balanceOf(token: PaymentToken, user: User): Promise<number> {
    return 0;
  }
}
