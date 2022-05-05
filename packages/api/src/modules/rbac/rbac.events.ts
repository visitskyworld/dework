import { Rule } from "@dewo/api/models/rbac/Rule";

export class RuleCreatedEvent {
  constructor(public readonly rule: Rule) {}
}

export class RuleDeletedEvent {
  constructor(public readonly rule: Rule) {}
}
