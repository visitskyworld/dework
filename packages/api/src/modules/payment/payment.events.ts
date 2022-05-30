import { Payment } from "@dewo/api/models/Payment";
import { Task } from "@dewo/api/models/Task";

export class PaymentConfirmedEvent {
  constructor(public readonly payment: Payment, public readonly task?: Task) {}
}

export class PaymentCreatedEvent {
  constructor(
    public readonly payment: Payment,
    public readonly task: Task,
    public readonly userId?: string
  ) {}
}
