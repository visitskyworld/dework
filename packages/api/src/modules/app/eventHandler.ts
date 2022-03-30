import { Logger } from "@nestjs/common";
import { IEventHandler } from "@nestjs/cqrs";

// EventHandler wrapper to prevent app from crashing if event handler fails
// https://github.com/nestjs/cqrs/issues/409
export abstract class EventHandler<T> implements IEventHandler<T> {
  private logger = new Logger(this.constructor.name);

  async handle(event: T) {
    if (process.env.NODE_ENV === "test") return;

    try {
      await this.process(event);
    } catch (error) {
      const errorString = JSON.stringify(
        error,
        Object.getOwnPropertyNames(error)
      );
      this.logger.error(
        `Failed handling event: ${JSON.stringify({ errorString, event })}`
      );
    }
  }

  abstract process(event: T): unknown;
}
