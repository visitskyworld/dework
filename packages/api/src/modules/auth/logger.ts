import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  logger = new Logger(this.constructor.name);

  use(req: Request, _res: Response, next: NextFunction): void {
    this.logger.debug(
      `${req.method} ${req.path}: ${JSON.stringify({
        params: req.params,
        body: req.body,
      })}`
    );
    next();
  }
}
